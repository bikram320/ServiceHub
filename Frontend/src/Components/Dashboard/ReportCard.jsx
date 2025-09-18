const ReportCard = ({ title, value, change }) => {
    return (
        <div className="report-card">
            <div className="report-value">{value}</div>
            <div className="report-title">{title}</div>
            <div className="report-change">{change}</div>
        </div>
    );
};

export default ReportCard;