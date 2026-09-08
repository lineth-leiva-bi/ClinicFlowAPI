using Microsoft.AspNetCore.Identity;

namespace ClinicFlowAPI
{
    public class SeguridadContrasenna
    {
        private readonly PasswordHasher<object> _hasher = new();
        private readonly object _usuario = new();

        public string HashPassword(string contrasenna)
        {
            return _hasher.HashPassword(_usuario, contrasenna);
        }

        public bool VerifyPassword(string hashedPassword, string contrasenna)
        {
            var result = _hasher.VerifyHashedPassword(
                _usuario,
                hashedPassword,
                contrasenna
            );

            return result == PasswordVerificationResult.Success;
        }
    }
}