using ClinicFlowAPI.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

namespace ClinicFlowAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Cliente> Clientes { get; set; }

        public DbSet<Cita> Citas { get; set; }
    }
}
