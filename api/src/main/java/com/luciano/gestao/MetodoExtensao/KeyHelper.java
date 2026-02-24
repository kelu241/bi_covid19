package com.luciano.gestao.MetodoExtensao;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

public class KeyHelper {
    public static SecretKey getKeyFromPassword(String password, String salt) throws Exception {
        MessageDigest sha = MessageDigest.getInstance("SHA-256");
        byte[] keyBytes = sha.digest((password + salt).getBytes(StandardCharsets.UTF_8));
        return new SecretKeySpec(keyBytes, 0, 16, "AES");
    }
}
