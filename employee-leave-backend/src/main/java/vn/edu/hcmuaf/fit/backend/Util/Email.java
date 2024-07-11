package vn.edu.hcmuaf.fit.backend.Util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.util.Map;
import java.util.Properties;

@Component
public class Email {
    //    String pass="auogzmiqdjuyxbji";
    static final String from = "tilemarket2022@gmail.com";
    static final String password = "auogzmiqdjuyxbji";
    @Autowired
    private EmailTemplateUtil emailTemplateUtil;

    @Async
    public void sendMailWithTemplate(String to, String subject, String templateName, Map<String, String> values) throws Exception {
        String content = emailTemplateUtil.getEmailTemplate(templateName, values);
        Properties properties = new Properties();
        properties.put("mail.smtp.host", "smtp.gmail.com");
        properties.put("mail.smtp.ssl.protocols", "TLSv1.2");
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");
        properties.put("mail.smtp.port", "587");

        //create Authentication
        Authenticator auth = new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(from, password);
            }
        };

        Session session = Session.getInstance(properties, auth);

        //Create Message
        MimeMessage msg = new MimeMessage(session);
        try {
            msg.addHeader("Content-tyoe", "text/HTML; charset=UTF-8");
            Address address = new InternetAddress(from, "Focus App");
            msg.setFrom(address);
            msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to, false));
            msg.setSubject(subject);
            msg.setContent(content, "text/HTML; charset=UTF-8");

            //send mail
            Transport.send(msg);
            System.out.println("EmailUtil sent successfully");
        } catch (MessagingException e) {
            System.out.println("EmailUtil sending failed");
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            System.out.println("EmailUtil sending failed");
            throw new RuntimeException(e);
        }
    }

    public static void sendMailWithoutTemplate(String to, String content, String subject) {
        Properties properties = new Properties();
        properties.put("mail.smtp.host", "smtp.gmail.com");
        properties.put("mail.smtp.ssl.protocols", "TLSv1.2"); //TLS 587 SSL 465
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");
        properties.put("mail.smtp.port", "587");

        //create Authentication
        Authenticator auth = new Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(from, password);
            }
        };

        Session session = Session.getInstance(properties, auth);

        //Create Message
        MimeMessage msg = new MimeMessage(session);
        try {
            msg.addHeader("Content-tyoe", "text/HTML; charset=UTF-8");
            Address address = new InternetAddress(from, "Tile Market");
            msg.setFrom(address);
            msg.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to, false));
            msg.setSubject(subject);
            msg.setContent(content, "text/HTML; charset=UTF-8");

            //send mail
            Transport.send(msg);
            System.out.println("Gửi Email thành công");
        } catch (MessagingException e) {
            System.out.println("Gửi Email không thành công");
            e.printStackTrace();
        } catch (UnsupportedEncodingException e) {
            System.out.println("Gửi Email không thành công");
            throw new RuntimeException(e);
        }
    }

    public static void main(String[] args) {
//        boolean status = "1".equals("1");
//        System.out.println(status);
//        test
//        sendMailWithAttachment("tranbuituanngoc@gmail.com", "Key mã hóa","abcaabacaxaca", "abxasdacacasdasdc ác", "qưkjhcv123kjhcaushuirfkjajsdygwecjkabsch");
        sendMailWithoutTemplate("tranbuituanngoc@gmail.com", "abc test mail", "test mail");
    }
}



