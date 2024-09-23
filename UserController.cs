using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using reactwebpage.Models;

namespace reactwebpage.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserController : ControllerBase
    {
        private readonly string _connectionString;

        public UserController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        [HttpGet]
        public IActionResult GetAllUsers()
        {
            try
            {
                using (var connection = new MySqlConnection(_connectionString))
                {
                    connection.Open();
                    var query = "SELECT UserId, FirstName, LastName, MobileNumber, EnrolmentDate, NativePlace, AreasOfInterest, Gender FROM Users WHERE is_deleted = 0;";
                    using (var cmd = new MySqlCommand(query, connection))
                    {
                        using (var reader = cmd.ExecuteReader())
                        {
                            var users = new List<User>();
                            while (reader.Read())
                            {
                                var user = new User
                                {
                                    UserId = reader.GetInt32("UserId"),
                                    FirstName = reader.GetString("FirstName"),
                                    LastName = reader.GetString("LastName"),
                                    MobileNumber = reader.GetString("MobileNumber"),
                                    EnrolmentDate = reader.GetDateTime("EnrolmentDate").ToString(),
                                    NativePlace = reader.GetString("NativePlace"),
                                    AreasOfInterest = reader.GetString("AreasOfInterest"),
                                    Gender = reader.GetString("Gender"),
                                };

                                users.Add(user);
                            }

                            return Ok(new { responseCode = 200, responseMessage = users });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { responseMessage = "An error occurred", error = ex.Message });
            }
        }

        [HttpPost("getbyid")]
        public IActionResult GetUserById([FromBody] GetById userId)
        {
            try
            {
                using (var connection = new MySqlConnection(_connectionString))
                {
                    connection.Open();
                    var query = "SELECT UserId, FirstName, LastName, MobileNumber, EnrolmentDate, NativePlace, AreasOfInterest, Gender FROM Users WHERE UserId = @UserId AND is_deleted = 0;";
                    using (var cmd = new MySqlCommand(query, connection))
                    {
                        cmd.Parameters.AddWithValue("@UserId", userId.UserId);

                        using (var reader = cmd.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                var user = new User
                                {
                                    UserId = reader.GetInt32("UserId"),
                                    FirstName = reader.GetString("FirstName"),
                                    LastName = reader.GetString("LastName"),
                                    MobileNumber = reader.GetString("MobileNumber"),
                                    EnrolmentDate = reader.GetDateTime("EnrolmentDate").ToString(),
                                    NativePlace = reader.GetString("NativePlace"),
                                    AreasOfInterest = reader.GetString("AreasOfInterest"),
                                    Gender = reader.GetString("Gender"),
                                };

                                return Ok(new { responseCode = 200, responseMessage = user });
                            }
                            else
                            {
                                return NotFound(new { responseCode = 404, responseMessage = "User not found" });
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { responseMessage = "An error occurred", error = ex.Message });
            }
        }

        [HttpPost]
        public IActionResult AddUser([FromBody] User user)
        {
            try
            {
                using (var connection = new MySqlConnection(_connectionString))
                {
                    connection.Open();
                    var query = "INSERT INTO Users (FirstName, LastName, MobileNumber, EnrolmentDate, NativePlace, AreasOfInterest, Gender) VALUES (@FirstName, @LastName, @MobileNumber, @EnrolmentDate, @NativePlace, @AreasOfInterest, @Gender)";
                    using (var cmd = new MySqlCommand(query, connection))
                    {
                        cmd.Parameters.AddWithValue("@FirstName", user.FirstName);
                        cmd.Parameters.AddWithValue("@LastName", user.LastName);
                        cmd.Parameters.AddWithValue("@MobileNumber", user.MobileNumber);
                        cmd.Parameters.AddWithValue("@EnrolmentDate", user.EnrolmentDate);
                        cmd.Parameters.AddWithValue("@NativePlace", user.NativePlace);
                        cmd.Parameters.AddWithValue("@AreasOfInterest", user.AreasOfInterest);
                        cmd.Parameters.AddWithValue("@Gender", user.Gender);

                        cmd.ExecuteNonQuery();
                    }
                }
                return Ok(new { responseCode = 200, responseMessage = "User added successfully!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { responseMessage = "An error occurred", error = ex.Message });
            }
        }

        [HttpPost("update")]
        public IActionResult UpdateUser([FromBody] User user)
        {
            try
            {
                using (var connection = new MySqlConnection(_connectionString))
                {
                    connection.Open();
                    var query = "UPDATE Users SET FirstName = @FirstName, LastName = @LastName, MobileNumber = @MobileNumber, EnrolmentDate = @EnrolmentDate, NativePlace = @NativePlace, AreasOfInterest = @AreasOfInterest, Gender = @Gender WHERE UserId = @UserId";
                    using (var cmd = new MySqlCommand(query, connection))
                    {
                        cmd.Parameters.AddWithValue("@FirstName", user.FirstName);
                        cmd.Parameters.AddWithValue("@LastName", user.LastName);
                        cmd.Parameters.AddWithValue("@MobileNumber", user.MobileNumber);
                        cmd.Parameters.AddWithValue("@EnrolmentDate", user.EnrolmentDate);
                        cmd.Parameters.AddWithValue("@NativePlace", user.NativePlace);
                        cmd.Parameters.AddWithValue("@AreasOfInterest", user.AreasOfInterest);
                        cmd.Parameters.AddWithValue("@Gender", user.Gender);
                        cmd.Parameters.AddWithValue("@UserId", user.UserId);

                        int rowsAffected = cmd.ExecuteNonQuery();
                        if (rowsAffected > 0)
                        {
                            return Ok(new { responseCode = 200, responseMessage = "User updated successfully!" });
                        }
                        else
                        {
                            return NotFound(new { responseCode = 404, responseMessage = "User not found!" });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { responseMessage = "An error occurred", error = ex.Message });
            }
        }

        [HttpPost("delete")]
        public IActionResult DeleteUser([FromBody] DeleteUser userId)
        {
            try
            {
                using (var connection = new MySqlConnection(_connectionString))
                {
                    connection.Open();
                    var query = "UPDATE Users SET is_deleted = 1 WHERE UserId = @UserId;";
                    using (var cmd = new MySqlCommand(query, connection))
                    {
                        cmd.Parameters.AddWithValue("@UserId", userId.UserId);

                        int rowsAffected = cmd.ExecuteNonQuery();
                        if (rowsAffected > 0)
                        {
                            return Ok(new { responseCode = 200, responseMessage = "User deleted successfully!" });
                        }
                        else
                        {
                            return NotFound(new { responseCode = 404, responseMessage = "User not found!" });
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { responseMessage = "An error occurred", error = ex.Message });
            }
        }
    }
}