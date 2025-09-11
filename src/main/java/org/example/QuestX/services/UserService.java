package org.example.QuestX.services;

import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.example.QuestX.Model.*;
import org.example.QuestX.Repository.*;
import org.example.QuestX.dtos.GetTechnicianDataRequest;
import org.example.QuestX.dtos.ServiceDetailsDto;
import org.example.QuestX.dtos.ServiceRequestDto;
import org.example.QuestX.exception.*;
import org.example.QuestX.exception.IllegalAccessException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@Service
public class UserService {


    private final UserRepository userRepository;
    private final LocationService locationService;
    private final TechnicianRepository technicianRepository;
    private final SkillRepository skillRepository;
    private final ServiceRequestRepository serviceRequestRepository;
    private final MailService mailService;
    private final FeedbackRepository feedBackRepository;


    // Update profile service
    public void UserProfileSetup(
            String email ,String phone , String address,
            Double latitude, Double longitude,
            MultipartFile profileImage , MultipartFile validDoc
    ) throws IOException {

        User user = userRepository.findByEmail(email).orElseThrow((
                () -> new UserNotFoundException("User Not Found")
                ));
        if(phone!=null){
            user.setPhone(phone);
        }
        if (latitude != null && longitude != null) {
            user.setLatitude(BigDecimal.valueOf(latitude));
            user.setLongitude(BigDecimal.valueOf(longitude));

            if (address == null || address.isEmpty()) {
                address = locationService.getAddressByCoordinates(latitude, longitude);
            }
        }
        if(address!=null && !address.isEmpty()){
            user.setAddress(address);
        }

        if (profileImage != null && !profileImage.isEmpty()) {

            String profilePath = "upload/users/profile-image/" + profileImage.getOriginalFilename();
            File destFile = new File(System.getProperty("user.dir") + "/ServiceHub/" + profilePath);

            // Create directories if not exists
            destFile.getParentFile().mkdirs();
            // Save the file
            profileImage.transferTo(destFile);

            user.setProfileImagePath(profilePath);
        }

        if (validDoc != null && !validDoc.isEmpty()) {
            String docPath = "upload/users/documents/" + validDoc.getOriginalFilename();
            File destFile = new File(System.getProperty("user.dir") + "/ServiceHub/" + docPath);
            destFile.getParentFile().mkdirs();
            validDoc.transferTo(destFile);
            user.setDocumentPath(docPath);
        }
        userRepository.save(user);
    }

    public List<GetTechnicianDataRequest> getTechnicianBasedOnSkill(String skill){
        Skill skillEntity = skillRepository.findByName(skill);
        var technicians = technicianRepository.findAvailableTechniciansBySkill(skillEntity.getId());
        if (technicians.isEmpty()) {
            throw new TechnicianNotFoundException("Technician Not Found");
        }

        return technicians.stream()
                .map(tech -> {
                    GetTechnicianDataRequest dto = new GetTechnicianDataRequest();
                    dto.setTechnicianName(tech.getName());
                    dto.setTechnicianAddress(tech.getAddress());
                    dto.setTechnicianPhone(tech.getPhone());
                    dto.setTechnicianBio(tech.getBio());
                    return dto;
                })
                .toList();

    }

    public void bookTechnicianForService(ServiceRequestDto request) throws MessagingException {
        User user = userRepository.findByEmail(request.getUserEmail()).orElseThrow(
                () -> new UserNotFoundException("User Not Found")
        );
        Technician technician =
                technicianRepository.findByEmailAndAvailable(request.getTechnicianEmail(),Boolean.TRUE);
        if (technician == null) {
            throw new TechnicianNotFoundException("Technician Not Found");
        }
        Skill skill = skillRepository.findByName(request.getServiceName());
        if (skill == null) {
            throw new ServiceNotFoundException("Service Not Found");
        }

        ServiceRequest serviceRequest = new ServiceRequest();
        serviceRequest.setUser(user);
        serviceRequest.setTechnician(technician);
        serviceRequest.setSkill(skill);

        LocalDateTime appointmentTime = request.getAppointmentTime();

        if (appointmentTime.isBefore(LocalDateTime.now())) {
            throw new InvalidDateTimeException("Appointment Time is Invalid");
        }

        int hour = appointmentTime.getHour();
        if (hour < 9 || hour >= 17) {
            throw new InvalidDateTimeException("Appointment must be between 9 AM and 5 PM");
        }

        if (hour == 13) {
            throw new InvalidDateTimeException("Technician is unavailable between 1 PM and 2 PM");
        }

        if (appointmentTime.getMinute() != 0 || appointmentTime.getSecond() != 0) {
            throw new InvalidDateTimeException("Appointments must start at the beginning of the hour");
        }
        LocalDateTime appointmentEnd = appointmentTime.plusHours(1);
        boolean conflict = serviceRequestRepository.existsByTechnicianAndAppointmentTimeBetween(
                technician, appointmentTime, appointmentEnd.minusSeconds(1)
        );
        if (conflict) {
            throw new InvalidDateTimeException("Technician is already booked for this time slot");
        }

        serviceRequest.setAppointmentTime(request.getAppointmentTime());
        serviceRequest.setDescription(request.getDescription());
        serviceRequest.setFeeCharged(request.getFee_charge());
        serviceRequest.setStatus(ServiceStatus.PENDING);
        serviceRequest.setCreatedAt(LocalDateTime.now());

        serviceRequestRepository.save(serviceRequest);

        mailService.sendMailToTechnician(user.getName(),technician.getEmail());

    }

    public List<ServiceDetailsDto> getCurrentServiceBooking(String email ){
        User user = userRepository.findByEmail(email).orElseThrow(
                () -> new UserNotFoundException("User Not Found")
        );
        List<ServiceStatus> Statuses = Arrays.asList(
                ServiceStatus.PENDING,
                ServiceStatus.IN_PROGRESS
        );
        return getServiceBooking(user, Statuses);
    }

    public List<ServiceDetailsDto> getPreviousServiceBooking(String email ){
        User user = userRepository.findByEmail(email).orElseThrow(
                () -> new UserNotFoundException("User Not Found")
        );
        List<ServiceStatus> Statuses = Arrays.asList(
                ServiceStatus.CANCELLED,
                ServiceStatus.COMPLETED
        );
        return getServiceBooking(user, Statuses);
    }

    public List<ServiceDetailsDto> getServiceBooking(User user , List<ServiceStatus> Statuses){

        List<ServiceRequest> serviceRequests =
                serviceRequestRepository.findByUserAndStatusIn(user, Statuses);
        if (serviceRequests.isEmpty()) {
            throw new ServiceNotFoundException("Service Not Found");
        }
        return serviceRequests.stream()
                .map( serviceRequest ->
                {
                    ServiceDetailsDto service = new ServiceDetailsDto();
                    service.setTechnicianName(serviceRequest.getTechnician().getName());
                    service.setTechnicianAddress(serviceRequest.getTechnician().getAddress());
                    service.setServiceName(serviceRequest.getSkill().getName());
                    service.setTechnicianEmail(serviceRequest.getTechnician().getEmail());
                    service.setAppointmentTime(serviceRequest.getAppointmentTime());
                    service.setFeeCharge(serviceRequest.getFeeCharged());
                    service.setStatus(serviceRequest.getStatus());
                    return service;
                })
                .collect(Collectors.toList());
    }

    public void UserCancelServiceBooking(String email  , Long id){
        User user = userRepository.findByEmail(email).orElseThrow(
                () -> new UserNotFoundException("User Not Found")
        );
        var serviceRequest = serviceRequestRepository.findByUserAndId(user,id);
        if (serviceRequest == null) {
            throw new ServiceNotFoundException("Service Not Found");
        }
        if(serviceRequest.getStatus() == ServiceStatus.CANCELLED){
            throw new StatusInvalidException("Status is already cancelled");
        }
        if(serviceRequest.getStatus() == ServiceStatus.COMPLETED || serviceRequest.getStatus() == ServiceStatus.IN_PROGRESS) {
            throw new StatusInvalidException("Status cannot be cancelled Anymore");
        }
        serviceRequest.setStatus(ServiceStatus.CANCELLED);
        serviceRequestRepository.save(serviceRequest);
    }

    public void userFeedbackToTechnician(Float rating, Long requestId , long userId , String comments){
        ServiceRequest service = serviceRequestRepository.findById(requestId).orElseThrow(
                () -> new ServiceNotFoundException("Service Not Found")
        );
        User user = userRepository.findById(userId).orElseThrow(
                () -> new UserNotFoundException("User Not Found")
        );
        if(!Objects.equals(user.getId(), service.getUser().getId())){
            throw new IllegalAccessException("you cannot give feedback for this service");
        }

        Optional<Feedback> existingFeedback = feedBackRepository.findByRequest_Id(requestId);
        if (existingFeedback.isPresent()) {
            throw new FeedbackAlreadyExistsException("You have already submitted feedback for this service request.");
        }
        Feedback feedback = new Feedback();
        feedback.setRating(rating);
        feedback.setRequest(service);
        feedback.setComments(comments);
        feedback.setCreatedAt(LocalDateTime.now());
        feedBackRepository.save(feedback);

        Technician technician = service.getTechnician();
        List<Feedback> technicianFeedbacks = feedBackRepository.findAllByRequest_Technician_Id(technician.getId());

        double avgRating = technicianFeedbacks.stream()
                .mapToDouble(Feedback::getRating)
                .average()
                .orElse(rating);

        technician.setRating((float)avgRating);
        serviceRequestRepository.save(service);


    }



}
