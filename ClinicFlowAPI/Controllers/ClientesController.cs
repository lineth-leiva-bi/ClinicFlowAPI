using Microsoft.AspNetCore.Mvc;
using ClinicFlowAPI.Models;

namespace ClinicFlowAPI.Controllers
{
    //convierte la clase en API
    [ApiController] 

    //cuando ingresen a api clientes ejecute este controller
    [Route("api/[controller]")]

    public class ClientesController : ControllerBase
    {

        private static List<Cliente> clientes = new List<Cliente>
        {
            new Cliente
            {
                Id = 1,
                Nombre = "Jacqueline",
                PrimerApellido = "Vargas",
                SegundoApellido = "Mora",
                Email = "jacqueline@gmail.com",
                Telefono = "8888-1111"
            }
        };

        /// Obtiene la lista completa de clientes registrados.
        [HttpGet]
        public IActionResult ObtenerClientes()
        {
            return Ok(clientes);
        }

        /// Registra un nuevo cliente en la lista.
        [HttpPost]
        public IActionResult CrearCliente([FromBody] Cliente cliente)
        {
            cliente.Id = clientes.Count + 1;

            clientes.Add(cliente);

            return Ok(cliente);
        }
    }
}