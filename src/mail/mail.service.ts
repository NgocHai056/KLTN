import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) {}

    async sendConfirmation(
        email: string,
        subject: string,
        template: string,
        context: any,
    ) {
        await this.mailerService.sendMail({
            to: email,
            // from: '"Support Team" <support@example.com>', // override default from
            subject: subject,
            template: template, // `.hbs` extension is appended automatically
            context: context,
        });
    }

    async sendEmailWithQRCode() {
        await this.mailerService.sendMail({
            to: "20110639@student.hcmute.edu.vn", // Địa chỉ email người nhận
            subject: "QR Code",
            text: "Vui lòng kiểm tra hình ảnh QR code được đính kèm.", // Nội dung email

            // Đính kèm hình ảnh QR code
            attachments: [
                {
                    filename: "qrcode.png", // Tên file đính kèm
                    content: Buffer.from(
                        "iVBORw0KGgoAAAANSUhEUgAAAJQAAACUCAYAAAB1PADUAAAAAklEQVR4AewaftIAAAT9SURBVO3BQY4kRxIEQdNA/f/Lyj76ZQNIpFcPZ2ki+CNVS06qFp1ULTqpWnRSteikatFJ1aKTqkUnVYtOqhadVC06qVp0UrXopGrRSdWik6pFn7wE5DepmYBsUjMBmdRMQG7UTEBu1ExAfpOaN06qFp1ULTqpWvTJMjWbgNyomYA8oWYC8oSaCciNmjfUbAKy6aRq0UnVopOqRZ98GZAn1DwBZFIzAXlDzQTkDSCTmjeAPKHmm06qFp1ULTqpWvTJX07NG0BugNyomYBMQCY1E5BJzd/spGrRSdWik6pFn/yfU/MGkElN/W8nVYtOqhadVC365MvUfBOQJ9R8k5obIJOaN9T8m5xULTqpWnRSteiTZUD+JDUTkBsgk5ongExqJiCTmgnIpOYGyL/ZSdWik6pFJ1WLPnlJzZ+k5gkgfxKQSc2Nmr/JSdWik6pFJ1WLPnkJyKRmAjKpeQLIjZon1ExAbtRMQCY1N2omIBOQSc0NkEnNDZBJzQRkUvPGSdWik6pFJ1WLPnlJzQTkDSCTmieA3AC5ATKpuQEyqZmATGqeAPKGmgnIN51ULTqpWnRSteiTl4C8AWRSMwGZ1NyomYDcqHlDzQTkBsiNmknNDZAn1ExANp1ULTqpWnRSteiTl9RMQJ5QMwGZ1PxJQCY1E5BJzSYgk5pJzRtqNp1ULTqpWnRStQh/5AUgk5oJyKRmAjKpmYBMat4AcqPmBsik5gkgN2qeAHKj5gbIpOaNk6pFJ1WLTqoWffKSmhs1E5BJzQRkUjMBeULNG0BugNyo+U1qboB800nVopOqRSdVi/BHXgAyqXkCyBtqboBMat4AMqmZgNyomYBMaiYgk5oJyBNqJiCTmjdOqhadVC06qVqEP/KLgNyouQHyhprfBGRS8wSQSc0TQCY133RSteikatFJ1aJPXgJyo+YNIJOaCcikZgJyA2RScwPkRs0NkEnNBGSTmhsgk5o3TqoWnVQtOqlahD/yRUAmNTdAJjUTkBs1N0CeUDMBeULNNwHZpOaNk6pFJ1WLTqoWffISkE1qJiCTmhsgT6iZgExAnlBzA2RSMwGZ1NyoeQPIppOqRSdVi06qFuGP/EFAJjVPAJnUTEAmNROQSc0E5Ak1E5BJzQRkUjMB2aTmm06qFp1ULTqpWvTJS0C+CciNmhs1E5BJzY2aGyA3ap4AsknNBGRSs+mkatFJ1aKTqkWfvKTmm9TcAJnU3KiZgExqboA8AWRSc6PmCSBPqJmATGreOKladFK16KRq0ScvAflNap4AcqNmAjKpuVFzo2YC8gSQSc2Nmj/ppGrRSdWik6pF+CMvAJnUbAIyqXkDyI2aCcikZgIyqXkCyKTmCSBPqPmmk6pFJ1WLTqoWffJlQJ5Q8waQSc2kZgIyAbkBMqm5AfIEkDfUPAFkUvPGSdWik6pFJ1WLPvmPAXKj5gbIBGRS84SaGyA3at5Qs+mkatFJ1aKTqkWf/OWATGpu1ExAJiCTmhs1E5A3gNyomYDcqJmA3Kh546Rq0UnVopOqRZ98mZpvUjMBmdRMQCY1bwCZ1ExAJjUTkEnNG2pu1HzTSdWik6pFJ1WLPlkG5DcBmdTcqLkBcqNmAvJNQCY1N0Bu1ExAJjVvnFQtOqladFK1CH+kaslJ1aKTqkUnVYtOqhadVC06qVp0UrXopGrRSdWik6pFJ1WLTqoWnVQtOqladFK16B8ii2EsfNShowAAAABJRU5ErkJggg==",
                        "base64",
                    ), // Buffer của hình ảnh QR code
                    encoding: "base64", // Encoding của dữ liệu là base64
                },
            ],
        });
    }
}
