using Microsoft.AspNetCore.Identity;

namespace ClinicFlowAPI
{
    public class SeguridadContrasenna
    {

        //convierte contraseña es Hasher por medio de passwordhasher
        private readonly PasswordHasher<string> _hasher = new();

        public string HashPassword (string contrasenna)
        {
            return _hasher.HashPassword(null, contrasenna);
        }

        public bool VerifyPassword(string hashedPassword, string contrasenna)
        {
            var result = _hasher.VerifyHashedPassword(null, hashedPassword, contrasenna);
            return result == PasswordVerificationResult.Success;
        }    
    }
}
