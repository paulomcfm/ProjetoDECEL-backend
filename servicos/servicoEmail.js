import nodemailer from "nodemailer";

// Configurações do seu provedor de e-mail (substitua com suas próprias credenciais)
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_PROVIDER,
    auth: {
        user: process.env.EMAIL_USER
    }
});


// Função para enviar e-mail com o código
export default function enviarCodigo(destinatario, codigo) {
    console.log(nodemailer);
    try {
        // Opções do e-mail
        const mailOptions = {
            from: 'seu_email',
            to: destinatario,
            subject: 'Código de Verificação',
            text: `Seu código de verificação é: ${codigo}`
        };

        // Envia o e-mail
        const info = transporter.sendMail(mailOptions);
        console.log('E-mail enviado: ', info.response);
        return true; // Indica que o e-mail foi enviado com sucesso
    } catch (error) {
        console.error('Erro ao enviar e-mail: ', error);
        return false; // Indica que houve um erro ao enviar o e-mail
    }
}