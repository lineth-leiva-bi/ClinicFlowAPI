namespace ClinicFlowAPI.DTOs
{
    public class RegistroUsuarioDto
    {
        public string Nombre { get; set; } = string.Empty;
        public string PrimerApellido { get; set; } = string.Empty;
        public string SegundoApellido { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public string Contrasenna { get; set; } = string.Empty;
    }
}