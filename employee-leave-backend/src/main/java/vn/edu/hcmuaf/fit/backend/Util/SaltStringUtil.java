package vn.edu.hcmuaf.fit.backend.Util;

import org.springframework.stereotype.Component;

import java.util.Random;

@Component
public class SaltStringUtil {
    public String getSaltString() {
        String SALTCHARS = "abcdefghiklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
        StringBuilder salt = new StringBuilder();
        Random rnd = new Random();
        while (salt.length() < 10) { // length of the random string.
            int index = (int) (rnd.nextFloat() * SALTCHARS.length());
            salt.append(SALTCHARS.charAt(index));
        }
        String saltStr = salt.toString();
        return saltStr;

    }
}
