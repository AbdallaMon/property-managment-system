import crypto from "crypto";
import prisma from "@/lib/prisma";
import {sendEmail} from "@/app/api/utlis/sendMail";

export async function POST(request) {
    let body = await request.json();

    try {
        const user = await prisma.user.findUnique({
            where: {
                email: body.email,
            },
        });
        if (!user) {
            return Response.json({
                status: 500,
                message: "No user found with this email",
            });
        }

        const token = crypto.randomBytes(20).toString("hex");
        await prisma.user.update({
            where: {
                email: body.email,
            },
            data: {
                resetPasswordToken: token,
                resetPasswordExpires: new Date(Date.now() + 3600000), // 1 hour
            },
        });
        const resetLink = `http://${request.headers.get("host")}/reset-password?token=${token}`;
        const emailSubject = "اعادة تعيين كلمة السر";
        const emailText = `اضغط علي الرابط لاعادة تعيين كلمة السر: ${resetLink}`;

        await sendEmail(body.email, emailSubject, emailText);

        return Response.json({
            status: 200,
            message: "تم ارسال رابط اعادة تعين كلمة السر الي  " + body.email,
        });
    } catch (error) {
        return Response.json({
            status: 500,
            message: "حدثت مشكلة اثناء اعادة تعيين كلمة السر  " + error.message,
        });
    }
}
