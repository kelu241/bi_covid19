package com.luciano.gestao.controller;
import com.luciano.gestao.security.Encriptacao;
import com.luciano.gestao.model.Usuario;
import com.luciano.gestao.repository.IUsuarioRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import com.luciano.gestao.MetodoExtensao.KeyHelper;
import javax.crypto.SecretKey;

@RestController
@RequestMapping("/usuario")
public class UsuarioController {
    @Autowired
    private com.luciano.gestao.security.JwtUtil jwtUtil;
    @Autowired
    private IUsuarioRepository usuarioRepository;

    String minhaSenha = "chave-mestra-123";
    String saltFixo = "sistema-legacy";

// 1. Gera a chave baseada na String
    SecretKey key;

    public UsuarioController() {
        try {
            key = KeyHelper.getKeyFromPassword(minhaSenha, saltFixo);
        } catch (Exception e) {
            throw new RuntimeException("Erro ao gerar a chave secreta", e);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Usuario usuario) throws Exception {

        
        String originalText = usuario.getSenha();
        
        // Encriptar
        String encrypted = Encriptacao.encrypt(originalText, key);
        usuario.setSenha(encrypted);



        
        var verifica_usuario = usuarioRepository.findByUsername(usuario.getUsername()).isPresent();
        var verifica_email = usuarioRepository.findByEmail(usuario.getEmail()).isPresent();
        if (verifica_usuario || verifica_email ) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Nome de usuário ou e-mail já existe");
        }
        usuarioRepository.save(usuario);
        return ResponseEntity.ok("Usuário registrado com sucesso");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> login) throws Exception {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByUsername(login.get("username"));
        String decrypted = Encriptacao.decrypt(usuarioOpt.get().getSenha(), key);
        if (usuarioOpt.isEmpty() || !decrypted.equals(login.get("senha"))) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Credenciais inválidas");
        }
    Usuario usuario = usuarioOpt.get();
    String accessToken = jwtUtil.generateTokenWithRole(usuario.getUsername(), usuario.getRole());
    String refreshToken = jwtUtil.generateRefreshToken(usuario.getUsername());
    usuario.setRefreshToken(refreshToken);
    usuarioRepository.save(usuario);
    Map<String, String> resp = new HashMap<>();
    resp.put("accessToken", accessToken);
    resp.put("refreshToken", refreshToken);
    resp.put("role", usuario.getRole());
    return ResponseEntity.ok(resp);
    }

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestBody Map<String, String> req) throws Exception {
        String refreshToken = req.get("refreshToken");
        Optional<Usuario> usuarioOpt = usuarioRepository.findByRefreshToken(refreshToken);
        if (usuarioOpt.isPresent() && jwtUtil.validateToken(refreshToken) && jwtUtil.isRefreshToken(refreshToken)) {
            Usuario usuario = usuarioOpt.get();
            String novoAccessToken = jwtUtil.generateToken(usuario.getUsername());
            Map<String, String> resp = new HashMap<>();
            resp.put("accessToken", novoAccessToken);
            return ResponseEntity.ok(resp);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token inválido");
    }

    @PostMapping("/revoke")
    public ResponseEntity<?> revoke(@RequestBody Map<String, String> req) throws Exception {
        Optional<Usuario> usuarioOpt = usuarioRepository.findByRefreshToken(req.get("refreshToken"));
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            usuario.setRefreshToken(null);
            usuarioRepository.save(usuario);
            return ResponseEntity.ok("Refresh token revogado");
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token inválido");
    }
}
