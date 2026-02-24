package com.luciano.gestao.security;

import javax.crypto.Cipher;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import java.util.Base64;
import java.security.SecureRandom;

public class Encriptacao {

    private static final String ALGORITHM = "AES/CBC/PKCS5Padding";
    private static final int IV_SIZE = 16; // AES block size

    // 1. Função de Encriptação
    public static String encrypt(String plainText, SecretKey key) throws Exception {
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        
        // Gera um IV aleatório (essencial para segurança)
        byte[] iv = new byte[IV_SIZE];
        new SecureRandom().nextBytes(iv);
        IvParameterSpec ivSpec = new IvParameterSpec(iv);
        
        cipher.init(Cipher.ENCRYPT_MODE, key, ivSpec);
        byte[] cipherText = cipher.doFinal(plainText.getBytes("UTF-8"));
        
        // Combina IV e texto cifrado para uso na desencriptação
        byte[] encryptedIvText = new byte[IV_SIZE + cipherText.length];
        System.arraycopy(iv, 0, encryptedIvText, 0, IV_SIZE);
        System.arraycopy(cipherText, 0, encryptedIvText, IV_SIZE, cipherText.length);
        
        // Retorna em Base64 para facilitar armazenamento/transporte
        return Base64.getEncoder().encodeToString(encryptedIvText);
    }

    // 2. Função de Desencriptação
    public static String decrypt(String encryptedTextBase64, SecretKey key) throws Exception {
        byte[] encryptedIvText = Base64.getDecoder().decode(encryptedTextBase64);
        
        // Extrai o IV do início do array
        byte[] iv = new byte[IV_SIZE];
        System.arraycopy(encryptedIvText, 0, iv, 0, IV_SIZE);
        IvParameterSpec ivSpec = new IvParameterSpec(iv);
        
        // Extrai o texto cifrado
        int cipherTextSize = encryptedIvText.length - IV_SIZE;
        byte[] cipherText = new byte[cipherTextSize];
        System.arraycopy(encryptedIvText, IV_SIZE, cipherText, 0, cipherTextSize);
        
        Cipher cipher = Cipher.getInstance(ALGORITHM);
        cipher.init(Cipher.DECRYPT_MODE, key, ivSpec);
        
        byte[] plainText = cipher.doFinal(cipherText);
        return new String(plainText, "UTF-8");
    }

}
