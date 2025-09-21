package org.example.QuestX.services;

import jakarta.mail.MessagingException;
import lombok.AllArgsConstructor;
import org.example.QuestX.Model.*;
import org.example.QuestX.Repository.PaymentRepository;
import org.example.QuestX.Repository.ServiceRequestRepository;
import org.example.QuestX.Repository.TechnicianRepository;
import org.example.QuestX.dtos.PaymentDetailsDto;
import org.example.QuestX.dtos.ServiceAndTechnicianDetailsDto;
import org.example.QuestX.dtos.ServiceAndUserDetailsDto;
import org.example.QuestX.dtos.TechnicianDto;
import org.example.QuestX.exception.ServiceNotFoundException;
import org.example.QuestX.exception.StatusInvalidException;
import org.example.QuestX.exception.TechnicianNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@AllArgsConstructor
@Service
public class TechnicianService {

    private  final TechnicianRepository technicianRepository;
    private final LocationService locationService;
    private final ServiceRequestRepository serviceRequestRepository;
    private final MailService mailService;
    private final PaymentRepository paymentRepository;

    public void technicianProfileSetup(String email , String phone, String address, Double latitude,
                                       Double longitude, String bio, MultipartFile profileImage,
                                       MultipartFile identityDoc, MultipartFile validDoc) throws IOException {
        Technician technician = technicianRepository.findByEmail(email);
        if(technician == null){
            throw new TechnicianNotFoundException("Technician not found");
        }

        if(phone!=null){
            technician.setPhone(phone);
        }
        if (address != null && !address.isEmpty()) {

            technician.setAddress(address);

            double[] coordinates = locationService.getCoordinatesFromAddress(address);
            if (coordinates != null) {
                technician.setLatitude(BigDecimal.valueOf(coordinates[0]));
                technician.setLongitude(BigDecimal.valueOf(coordinates[1]));
            }
        }
        else if (latitude != null && longitude != null) {
            technician.setLatitude(BigDecimal.valueOf(latitude));
            technician.setLongitude(BigDecimal.valueOf(longitude));

            String resolvedAddress = locationService.getAddressByCoordinates(latitude, longitude);
            if (resolvedAddress != null && !resolvedAddress.isEmpty()) {
                technician.setAddress(resolvedAddress);
            }
        }

        if(bio!=null && !bio.isEmpty()){
            technician.setBio(bio);
        }

        if (profileImage != null && !profileImage.isEmpty()) {

            String profilePath = "upload/technician/profile-image/" + profileImage.getOriginalFilename();
            File destFile = new File(System.getProperty("user.dir") + "/QuestXDataFolder/" + profilePath);

            // Create directories if not exists
            destFile.getParentFile().mkdirs();
            // Save the file
            profileImage.transferTo(destFile);

            technician.setProfileImagePath(profilePath);
        }

        if (validDoc != null && !validDoc.isEmpty()) {
            String docPath = "upload/technician/documents/" + validDoc.getOriginalFilename();
            File destFile = new File(System.getProperty("user.dir") + "/QuestXDataFolder/" + docPath);
            destFile.getParentFile().mkdirs();
            validDoc.transferTo(destFile);
            technician.setValidDocumentPath(docPath);
        }
        if (identityDoc != null && !identityDoc.isEmpty()) {
            String docPath = "upload/technician/identity-Proof/" + identityDoc.getOriginalFilename();
            File destFile = new File(System.getProperty("user.dir") + "/QuestXDataFolder/" + docPath);
            destFile.getParentFile().mkdirs();
            identityDoc.transferTo(destFile);
            technician.setIdentityPath(docPath);
        }
        technician.setStatus(Status.PENDING);
        technicianRepository.save(technician);
    }

    public void acceptingUserServiceRequest(long requestId) throws MessagingException {

        ServiceRequest serviceRequest = serviceRequestRepository.findById(requestId).orElseThrow(
                () -> new ServiceNotFoundException("ServiceRequest  not found")
        );
        if(!serviceRequest.getStatus().equals(ServiceStatus.PENDING))
            throw new StatusInvalidException("You can't accept this ServiceRequest Anymore");

        serviceRequest.setStatus(ServiceStatus.IN_PROGRESS);
        serviceRequestRepository.save(serviceRequest);

        //sending mail to user about their request status
        mailService.sendMailtoUserAboutRequest(serviceRequest.getUser().getEmail(),
                serviceRequest.getTechnician().getName(),
                serviceRequest.getSkill().getName(),
                serviceRequest.getAppointmentTime(),
                ServiceStatus.ACCEPTED);
    }

    public void rejectingUserServiceRequest(long requestId) throws MessagingException {
        ServiceRequest serviceRequest = serviceRequestRepository.findById(requestId).orElseThrow(
                () -> new ServiceNotFoundException("ServiceRequest  not found")
        );
        if (!serviceRequest.getStatus().equals(ServiceStatus.PENDING)){
            throw new StatusInvalidException("You can't reject this ServiceRequest Anymore");
        }
        serviceRequest.setStatus(ServiceStatus.REJECTED);
        serviceRequestRepository.save(serviceRequest);

        //sending mail to user about their request status
        mailService.sendMailtoUserAboutRequest(serviceRequest.getUser().getEmail(),
                serviceRequest.getTechnician().getName(),
                serviceRequest.getSkill().getName(),
                serviceRequest.getAppointmentTime(),
                ServiceStatus.REJECTED);
    }

    public TechnicianDto getProfile(String email){
        Technician tech = technicianRepository.findByEmail(email);
        if(tech == null){
            throw new TechnicianNotFoundException("Technician not found");
        }
        TechnicianDto technicianDto = new TechnicianDto();
        technicianDto.setTechnicianName(tech.getName());
        technicianDto.setEmail(tech.getEmail());
        technicianDto.setPhone(tech.getPhone());
        technicianDto.setAddress(tech.getAddress());
        technicianDto.setProfileImagePath(tech.getProfileImagePath());
        technicianDto.setDocumentPath(tech.getValidDocumentPath());
        technicianDto.setIdentityPath(tech.getIdentityPath());

        return technicianDto;
    }


    public List<ServiceAndUserDetailsDto> getCurrentRequest(String email){
        var technician = technicianRepository.findByEmail(email);
        if(technician == null){
            throw new TechnicianNotFoundException("Technician not found");
        }
        List<ServiceStatus> Statuses = Arrays.asList(
                ServiceStatus.PENDING,
                ServiceStatus.IN_PROGRESS
        );
        return getServiceBooking(technician, Statuses);
    }
    public List<ServiceAndUserDetailsDto> getPreviousRequest(String email){
        var technician = technicianRepository.findByEmail(email);
        if(technician == null){
            throw new TechnicianNotFoundException("Technician not found");
        }
        List<ServiceStatus> Statuses = Arrays.asList(
                ServiceStatus.COMPLETED,
                ServiceStatus.CANCELLED
        );
        return getServiceBooking(technician , Statuses);
    }
    public List<ServiceAndUserDetailsDto> getServiceBooking(Technician technician , List<ServiceStatus> Statuses){

        List<ServiceRequest> serviceRequests =
                serviceRequestRepository.findByTechnicianAndStatusIn(technician, Statuses);
        if (serviceRequests.isEmpty()) {
            throw new ServiceNotFoundException("Service Not Found");
        }
        return serviceRequests.stream()
                .map( serviceRequest ->
                {
                    ServiceAndUserDetailsDto service = new ServiceAndUserDetailsDto();
                    service.setUsername(serviceRequest.getUser().getName());
                    service.setUserAddress(serviceRequest.getUser().getAddress());
                    service.setUserPhone(serviceRequest.getUser().getPhone());
                    service.setServiceName(serviceRequest.getSkill().getName());
                    service.setUserEmail(serviceRequest.getUser().getEmail());
                    service.setAppointmentTime(serviceRequest.getAppointmentTime());
                    service.setFeeCharge(serviceRequest.getFeeCharged());
                    service.setStatus(serviceRequest.getStatus());
                    return service;
                })
                .collect(Collectors.toList());
    }

    public List<PaymentDetailsDto> getPendingPayments(String email){
       return getPaymentsByStatus(email, PaymentStatus.HOLD);
    }
    public List<PaymentDetailsDto> getReceivedPayments(String email){
        return getPaymentsByStatus(email , PaymentStatus.RELEASED );
    }
    public List<PaymentDetailsDto> getPaymentsByStatus(String email , PaymentStatus status){
        List<ServiceRequest> serviceRequests = serviceRequestRepository.
                getServiceRequestByTechnicianEmailAndPayment_Status(email,status);
        if(serviceRequests == null){
            throw new ServiceNotFoundException("ServiceRequest  not found");
        }

        return serviceRequests.stream()
                .map( serviceRequest ->{
                            PaymentDetailsDto paymentDetails = new PaymentDetailsDto();
                            paymentDetails.setUserId(serviceRequest.getUser().getId());
                            paymentDetails.setUserName(serviceRequest.getUser().getName());
                            paymentDetails.setServiceName(serviceRequest.getSkill().getName());
                            paymentDetails.setServiceDate(serviceRequest.getAppointmentTime());
                            paymentDetails.setAmount(serviceRequest.getFeeCharged());
                            paymentDetails.setStatus(serviceRequest.getPayment().getStatus());
                            return paymentDetails;
                        }
                )
                .collect(Collectors.toList());
    }
}
