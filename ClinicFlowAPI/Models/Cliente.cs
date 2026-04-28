namespace ClinicFlowAPI.Models
{
    public class Cliente
    {
        public int Id { get; set; }

        public string Nombre { get; set; } = string.Empty;

        public string PrimerApellido { get; set; } = string.Empty;

        public string SegundoApellido { get; set; } = string.Empty;

        public string Email { get; set; } = string.Empty;

        public string Telefono { get; set; } = string.Empty;
    }
    //empty da un valor inicial vacío
}