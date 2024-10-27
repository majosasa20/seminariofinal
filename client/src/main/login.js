import '../main/styles.css';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import styles from './login.module.css'; 
import Axios from "axios";
import Swal from "sweetalert2";
import { useAuth } from './authContext'; // Importa el contexto


function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth(); 
  const navigate = useNavigate(); 

  function handleSubmit(event) {
    event.preventDefault(); 
    Axios.post("http://localhost:3001/server/login", {
        correoUsuario: email,
        contraseniaUser: password 
    })
    .then((response) => {
      console.log("datosuser",JSON.stringify(response.data));
      const { user } = response.data; 
      login(user);
        // Almacenar el token o cualquier indicador de sesión en localStorage
        localStorage.setItem("userSession", JSON.stringify(response.data));
        Swal.fire({
          icon: "success",
          title: "¡Éxito!",
          text: response.data.message || "Login Exitoso",
          // timer: 3000, // 3 segundos
          // timerProgressBar: true, // Barra de progreso
          willClose: () => {
            window.location.href = "/"; // Redirigir al inicio
          },
      });
    })
    .catch((error) => {
        console.error("Login Fallido", error);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: error.response
                ? error.response.data.message
                : "Login fallido.",
            confirmButtonText: "Aceptar",
            willClose: () => {
                window.location.reload();
            },
        });
    });
  }

  return (
    <div className="login">
      <div className={styles.container}>
        <div className={styles.loginBox}>
          <h2 className={styles.loginTitle}>Iniciar Sesión</h2>
          
          <form onSubmit={handleSubmit}>
            <div className={styles.inputGroup}>
              <label className={styles.inputLabel} htmlFor="email">Correo Electrónico</label>
              <input
                // type="email" // Cambia de tipo a email para validación
                id="email"
                className={styles.inputField}
                placeholder="tu.email@example.com"
                required
                onChange={e => setEmail(e.target.value)}
              />
            </div>

            <div className={styles.inputGroup}>
              <label className={styles.inputLabel} htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                className={styles.inputField}
                placeholder="********"
                required
                onChange={e => setPassword(e.target.value)}
              />
            </div>

            <div className={styles.optionsGroup}>
              <label className={styles.rememberMe}>
                {/* <input type="checkbox" className={styles.checkbox} />
                Recordarme */}
              </label>
              {/* <a href="#" className={styles.forgotPassword}>¿Olvidaste tu contraseña?</a> */}
            </div>

            <button type="submit" className={styles.loginButton}>Iniciar Sesión</button>
          </form>

          <div className={styles.registerLink}>
            {/* <p>¿No tienes una cuenta? <a href="#" className={styles.link}>Regístrate aquí</a></p> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
