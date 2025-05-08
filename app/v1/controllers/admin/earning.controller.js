
const Payment = require("../../models/Payment");
const User = require("../../models/User");

const earningRation = async (req, res, next) => {
    try {
        const admin = req.user.role;

        if (admin !== "admin") {
            return res.status(404).json({
                status: "error",
                statusCode: 404,
                message: "You are not an admin."
            });
        }

        // Get the year from the query or use the current year as default
        const year = req.query.year || new Date().getFullYear();

        // Ensure the year is a valid number
        if (isNaN(year) || year < 1900 || year > 2100) {
            return res.status(400).json({
                status: "error",
                statusCode: 400,
                message: "Invalid year. Please provide a valid year."
            });
        }

        // Fetch all payments for the specified year
        const payments = await Payment.find({
            createdAt: {
                $gte: new Date(`${year}-01-01T00:00:00Z`), // From January 1st
                $lte: new Date(`${year}-12-31T23:59:59Z`)  // To December 31st
            }
        });

        // Initialize all 12 months with zero earnings
        const monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];

        const earningsByMonth = monthNames.map(name => ({
            month: name,
            totalEarnings: 0
        }));

        // Calculate monthly earnings
        payments.forEach(payment => {
            const month = new Date(payment.createdAt).getMonth(); // 0-based month
            earningsByMonth[month].totalEarnings += payment.amount;
        });

        // Highlight the current month's earnings if the year is the current year
        const currentYear = new Date().getFullYear();
        const currentMonth = year == currentYear ? new Date().getMonth() : null;
        const currentMonthEarnings = currentMonth !== null
            ? earningsByMonth[currentMonth]
            : null;

        res.status(200).json({
            status: "success",
            statusCode: 200,
            message: `Monthly earnings retrieved successfully for the year ${year}.`,
            data: {
                year,
                allMonths: earningsByMonth,
                currentMonth: currentMonthEarnings
            }
        });
    } catch (error) {
        next(error);
    }
};

const payedUsers=async(req,res,next)=>{
    try {
        const admin = req.user.role;

        if (admin !== "admin") {
            return res.status(404).json({
                status: "error",
                statusCode: 404,
                message: "You are not an admin."
            });
        }

        const userTrancation=await Payment.find().populate("userId")
        res.status(200).json({
            status: "success",
            statusCode: 200,
            message: `show all payemtn users`,
            data: userTrancation
            
        });




        
    } catch (error) {
        next(error)
    }
}

const dashboredBar = async (req, res, next) => {
    try {
        // Fetch all payment records
        const totalEarnings = await Payment.find({}, "amount"); // Only select the 'amount' field for efficiency

        // Calculate the total earnings
        const totalAmount = totalEarnings.reduce((acc, cur) => acc + cur.amount, 0);

        const user=await User.find({role:"user",isVerified:true}).countDocuments()
        const agency=await User.find({role:"agency",isVerified:true}).countDocuments()

        const data={
            totalEran:totalAmount.toFixed(2),
            users:user,
            agency
        }

        res.status(200).json({
            status: "success",
            statusCode: 200,
            message: "Dashboard bar data retrieved successfully.",
       
            data: data
        });
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
};



module.exports={
    earningRation,
    payedUsers,
    dashboredBar
}