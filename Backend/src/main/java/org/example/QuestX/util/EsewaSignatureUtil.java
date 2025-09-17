package org.example.QuestX.util;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public class EsewaSignatureUtil {
    public static String generateEsewaSignature(String secretKey, String message) throws Exception {
        Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
        SecretKeySpec secret_key = new SecretKeySpec(secretKey.getBytes(), "HmacSHA256");
        sha256_HMAC.init(secret_key);
        byte[] hashBytes = sha256_HMAC.doFinal(message.getBytes());
        return Base64.getEncoder().encodeToString(hashBytes);
    }
}
