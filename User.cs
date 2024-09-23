namespace reactwebpage.Models
{
    public class User
    {
        public int UserId { get; set; }

        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string MobileNumber { get; set; }
        public string EnrolmentDate { get; set; }
        public string NativePlace { get; set; }
        public string AreasOfInterest { get; set; }
        public string Gender { get; set; }
    }

    public class DeleteUser
    {
        public int UserId { get; set; }
    }
    public class GetById
    {
        public int UserId { get; set; }
    }
}

