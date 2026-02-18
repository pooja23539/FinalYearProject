import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import api from "../api/axios";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { logout } = useAuth();
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [showProgramForm, setShowProgramForm] = useState(false);
  const [showSubjects, setShowSubjects] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [showCourseAllocation, setShowCourseAllocation] = useState(false);
  const [showHome, setShowHome] = useState(true);
  const [teacherData, setTeacherData] = useState({ name: "", email: "", status: 1 });
  const [programData, setProgramData] = useState({ name: "" });
  const [subjectData, setSubjectData] = useState({ name: "", code: "", program: "", semester: "", teacher: "" });
  const [userData, setUserData] = useState({ 
    username: "", 
    email: "", 
    password: "", 
    status: true, 
    role: "",
    fullName: "",
    address: "",
    contact: "",
    rollNo: "",
    program: "",
    semester: ""
  });
  const [studentData, setStudentData] = useState({ name: "", rollNo: "", status: 1, program: "", semester: "" });
  const [courseData, setCourseData] = useState({ course: "", faculty: "", semester: "" });
  const [allocationData, setAllocationData] = useState({ faculty: "", semester: "", subject: "", teacher: "" });
  const [allocations, setAllocations] = useState([]);
  const [selectedAllocationFaculty, setSelectedAllocationFaculty] = useState("");
  const [selectedAllocationTeacher, setSelectedAllocationTeacher] = useState("");
  const [users, setUsers] = useState([]);
  const [editingStudents, setEditingStudents] = useState({});
  const [editStudentData, setEditStudentData] = useState({});
  const [editingUsers, setEditingUsers] = useState({});
  const [editUserData, setEditUserData] = useState({});
  const [editingSubjects, setEditingSubjects] = useState({});
  const [editSubjectData, setEditSubjectData] = useState({});
  const [editingAllocations, setEditingAllocations] = useState({});
  const [editAllocationData, setEditAllocationData] = useState({});
  const [faculties, setFaculties] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedSemester, setSelectedSemester] = useState("");
  const [homeSelectedProgram, setHomeSelectedProgram] = useState("");
  const [homeSelectedSemester, setHomeSelectedSemester] = useState("");
  const [homeSelectedSubject, setHomeSelectedSubject] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [attendanceLoading, setAttendanceLoading] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchStudents();
    fetchTeachers();
    fetchPrograms();
    fetchSemesters();
    fetchFaculties();
    fetchSubjects();
  }, []);

  const fetchFaculties = async () => {
    try {
      const response = await api.get("/faculties");
      setFaculties(response.data);
    } catch (err) {
      console.error("Failed to fetch faculties:", err);
    }
  };

  const fetchAllocations = async () => {
    try {
      const response = await api.get("/api/course-allocations");
      setAllocations(response.data);
    } catch (err) {
      console.error("Failed to fetch allocations:", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get("/api/users");
      setUsers(response.data);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await api.get("/roles");
      setRoles(response.data);
    } catch (err) {
      console.error("Failed to fetch roles:", err);
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await api.get("/api/program");
      setPrograms(response.data);
    } catch (err) {
      console.error("Failed to fetch programs:", err);
    }
  };

  const fetchSemesters = async () => {
    try {
      const response = await api.get("/semesters");
      setSemesters(response.data);
    } catch (err) {
      console.error("Failed to fetch semesters:", err);
    }
  };

  const fetchAttendance = async () => {
    try {
      const response = await api.get("/api/attendance");
      setAttendance(response.data);
    } catch (err) {
      console.error("Failed to fetch attendance:", err);
    }
  };

  const fetchTeachers = async () => {
    try {
      const response = await api.get("/api/teachers");
      setTeachers(response.data);
    } catch (err) {
      console.error("Failed to fetch teachers:", err);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await api.get("/subjects");
      setSubjects(response.data);
    } catch (err) {
      console.error("Failed to fetch subjects:", err);
    }
  };

  const fetchStudents = async () => {
    try {
      console.log("Fetching students...");
      const response = await api.get("/api/student");
      console.log("Students response:", response.data);
      setStudents(response.data);
    } catch (err) {
      console.error("Failed to fetch students:", err);
      console.error("Error details:", err.response?.data);
    }
  };

  const markAttendance = async (studentId, status) => {
    if (!homeSelectedSubject) {
      setError("Please select a subject before marking attendance");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setAttendanceLoading(prev => ({ ...prev, [studentId]: true }));
    
    try {
      let statusValue;
      if (status === 'present') {
        statusValue = 'P';
      } else if (status === 'absent') {
        statusValue = 'A';
      } else if (status === 'leave') {
        statusValue = 'L';
      }

      await api.post("/api/attendance", {
        student: { id: studentId },
        subject: { id: parseInt(homeSelectedSubject) },
        status: statusValue,
        date: new Date().toISOString().split('T')[0]
      });
      setSuccess(`Attendance marked as ${status}!`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || `Failed to mark ${status}`);
    } finally {
      setAttendanceLoading(prev => ({ ...prev, [studentId]: false }));
    }
  };

  const handleTeacherSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!teacherData.name || !teacherData.email) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/teachers", teacherData);
      setSuccess("Teacher added successfully!");
      setTeacherData({ name: "", email: "", status: 1 });
      fetchTeachers();
      setShowTeacherForm(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add teacher");
    } finally {
      setLoading(false);
    }
  };

  const handleCourseAllocationSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!allocationData.faculty || !allocationData.semester || !allocationData.subject || !allocationData.teacher) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/course-allocations", {
        faculty: { id: parseInt(allocationData.faculty) },
        semester: { id: parseInt(allocationData.semester) },
        subject: { id: parseInt(allocationData.subject) },
        teacher: { id: parseInt(allocationData.teacher) }
      });
      setSuccess("Course allocated successfully!");
      setAllocationData({ faculty: "", semester: "", subject: "", teacher: "" });
      fetchAllocations();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to allocate course");
    } finally {
      setLoading(false);
    }
  };

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!studentData.name || !studentData.rollNo || !studentData.program || !studentData.semester) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/student", {
        name: studentData.name,
        rollNo: studentData.rollNo,
        status: parseInt(studentData.status),
        program: { id: parseInt(studentData.program) },
        semester: { id: parseInt(studentData.semester) }
      });
      setSuccess("Student added successfully!");
      setStudentData({ name: "", rollNo: "", status: 1, program: "", semester: "" });
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add student");
    } finally {
      setLoading(false);
    }
  };

  const handleStudentCheckbox = (studentId, isChecked) => {
    setEditingStudents(prev => ({
      ...prev,
      [studentId]: isChecked
    }));
    
    if (isChecked) {
      const student = students.find(s => s.id === studentId);
      setEditStudentData(prev => ({
        ...prev,
        [studentId]: {
          name: student.name,
          rollNo: student.rollNo,
          program: student.program?.id || '',
          semester: student.semester?.id || ''
        }
      }));
    }
  };

  const handleEditStudentChange = (studentId, field, value) => {
    setEditStudentData(prev => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        [field]: value
      }
    }));
  };

  const handleUpdateStudent = async (studentId) => {
    try {
      setLoading(true);
      const data = editStudentData[studentId];
      const student = students.find(s => s.id === studentId);
      await api.put(`/api/student/${studentId}`, {
        name: data.name,
        rollNo: data.rollNo,
        status: student.status,
        program: { id: parseInt(data.program) },
        semester: { id: parseInt(data.semester) }
      });
      setSuccess("Student updated successfully!");
      setEditingStudents(prev => ({ ...prev, [studentId]: false }));
      fetchStudents();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update student");
    } finally {
      setLoading(false);
    }
  };

  const handleBlockStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to block this student?")) {
      try {
        setLoading(true);
        await api.delete(`/api/student/${studentId}`);
        setSuccess("Student blocked successfully!");
        fetchStudents();
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to block student");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUnblockStudent = async (studentId) => {
    if (window.confirm("Are you sure you want to unblock this student?")) {
      try {
        setLoading(true);
        const student = students.find(s => s.id === studentId);
        await api.put(`/api/student/${studentId}`, {
          name: student.name,
          rollNo: student.rollNo,
          status: 1,
          program: { id: student.program?.id },
          semester: { id: student.semester?.id }
        });
        setSuccess("Student unblocked successfully!");
        fetchStudents();
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to unblock student");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSubjectCheckbox = (subjectId, isChecked) => {
    setEditingSubjects(prev => ({
      ...prev,
      [subjectId]: isChecked
    }));
    
    if (isChecked) {
      const subject = subjects.find(s => s.id === subjectId);
      setEditSubjectData(prev => ({
        ...prev,
        [subjectId]: {
          name: subject.name,
          code: subject.code,
          program: subject.program?.id || '',
          semester: subject.semester?.id || '',
          teacher: subject.teacher?.id || ''
        }
      }));
    }
  };

  const handleEditSubjectChange = (subjectId, field, value) => {
    setEditSubjectData(prev => ({
      ...prev,
      [subjectId]: {
        ...prev[subjectId],
        [field]: value
      }
    }));
  };

  const handleUpdateSubject = async (subjectId) => {
    try {
      setLoading(true);
      const data = editSubjectData[subjectId];
      await api.put(`/subjects/${subjectId}`, {
        name: data.name,
        code: data.code,
        program: { id: parseInt(data.program) },
        semester: { id: parseInt(data.semester) },
        teacher: { id: parseInt(data.teacher) }
      });
      setSuccess("Subject updated successfully!");
      setEditingSubjects(prev => ({ ...prev, [subjectId]: false }));
      fetchSubjects();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update subject");
    } finally {
      setLoading(false);
    }
  };

  const handleAllocationCheckbox = (allocationId, isChecked) => {
    setEditingAllocations(prev => ({
      ...prev,
      [allocationId]: isChecked
    }));
    
    if (isChecked) {
      const allocation = allocations.find(a => a.id === allocationId);
      setEditAllocationData(prev => ({
        ...prev,
        [allocationId]: {
          faculty: allocation.faculty?.id || '',
          semester: allocation.semester?.id || '',
          subject: allocation.subject?.id || '',
          teacher: allocation.teacher?.id || ''
        }
      }));
    }
  };

  const handleEditAllocationChange = (allocationId, field, value) => {
    setEditAllocationData(prev => ({
      ...prev,
      [allocationId]: {
        ...prev[allocationId],
        [field]: value
      }
    }));
  };

  const handleUpdateAllocation = async (allocationId) => {
    try {
      setLoading(true);
      const data = editAllocationData[allocationId];
      await api.put(`/api/course-allocations/${allocationId}`, {
        faculty: { id: parseInt(data.faculty) },
        semester: { id: parseInt(data.semester) },
        subject: { id: parseInt(data.subject) },
        teacher: { id: parseInt(data.teacher) }
      });
      setSuccess("Allocation updated successfully!");
      setEditingAllocations(prev => ({ ...prev, [allocationId]: false }));
      fetchAllocations();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update allocation");
    } finally {
      setLoading(false);
    }
  };

  const handleUserCheckbox = (userId, isChecked) => {
    setEditingUsers(prev => ({
      ...prev,
      [userId]: isChecked
    }));
    
    if (isChecked) {
      const user = users.find(u => u.id === userId);
      setEditUserData(prev => ({
        ...prev,
        [userId]: {
          username: user.username,
          email: user.email,
          role: user.role?.code || ''
        }
      }));
    }
  };

  const handleEditUserChange = (userId, field, value) => {
    setEditUserData(prev => ({
      ...prev,
      [userId]: {
        ...prev[userId],
        [field]: value
      }
    }));
  };

  const handleUpdateUser = async (userId) => {
    try {
      setLoading(true);
      const data = editUserData[userId];
      const role = roles.find(r => r.code === data.role);
      const user = users.find(u => u.id === userId);
      await api.put(`/api/users/${userId}`, {
        username: data.username,
        email: data.email,
        status: user.status,
        role: { id: role?.id }
      });
      setSuccess("User updated successfully!");
      setEditingUsers(prev => ({ ...prev, [userId]: false }));
      fetchUsers();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId) => {
    if (window.confirm("Are you sure you want to block this user?")) {
      try {
        setLoading(true);
        await api.delete(`/api/users/${userId}`);
        setSuccess("User blocked successfully!");
        fetchUsers();
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to block user");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUnblockUser = async (userId) => {
    if (window.confirm("Are you sure you want to unblock this user?")) {
      try {
        setLoading(true);
        const user = users.find(u => u.id === userId);
        await api.put(`/api/users/${userId}`, {
          username: user.username,
          email: user.email,
          status: true,
          role: { id: user.role?.id }
        });
        setSuccess("User unblocked successfully!");
        fetchUsers();
        setTimeout(() => setSuccess(""), 3000);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to unblock user");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!userData.username || !userData.email || !userData.password || !userData.role || !userData.fullName) {
      setError("Please fill in all required fields");
      return;
    }

    if (userData.role === 'STD' && (!userData.rollNo || !userData.program || !userData.semester)) {
      setError("Roll No, Program and Semester are required for students");
      return;
    }

    try {
      setLoading(true);
      
      // Create user first
      const userResponse = await api.post("/api/users/register", {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        role: userData.role,
        address: userData.address
      });

      const createdUser = userResponse.data;

      // Create student or teacher record based on role
      if (userData.role === 'STD') {
        console.log('Creating student with data:', {
          name: userData.fullName,
          rollNo: userData.rollNo,
          contact: userData.contact || '',
          address: userData.address || '',
          status: 1,
          userId: createdUser.id,
          programId: parseInt(userData.program),
          semesterId: parseInt(userData.semester)
        });
        
        const studentResponse = await api.post("/api/student", {
          name: userData.fullName,
          rollNo: userData.rollNo,
          contact: userData.contact || '',
          address: userData.address || '',
          status: 1,
          userId: createdUser.id,
          programId: parseInt(userData.program),
          semesterId: parseInt(userData.semester)
        });
        
        console.log('Student created:', studentResponse.data);
      } else if (userData.role === 'TEACHER') {
        const teacherResponse = await api.post("/api/teachers", {
          fullName: userData.fullName,
          contact: userData.contact || '',
          address: userData.address || '',
          status: 1,
          userId: createdUser.id
        });
        
        console.log('Teacher created:', teacherResponse.data);
      }

      setSuccess("User added successfully!");
      setUserData({ 
        username: "", 
        email: "", 
        password: "", 
        status: true, 
        role: "",
        fullName: "",
        address: "",
        contact: "",
        rollNo: "",
        program: "",
        semester: ""
      });
      fetchUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add user");
    } finally {
      setLoading(false);
    }
  };

  const handleSubjectSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!subjectData.name || !subjectData.code || !subjectData.program || !subjectData.semester || !subjectData.teacher) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await api.post("/subjects", {
        name: subjectData.name,
        code: subjectData.code,
        program: { id: parseInt(subjectData.program) },
        semester: { id: parseInt(subjectData.semester) },
        teacher: { id: parseInt(subjectData.teacher) }
      });
      setSuccess("Subject added successfully!");
      setSubjectData({ name: "", code: "", program: "", semester: "", teacher: "" });
      fetchSubjects();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add subject");
    } finally {
      setLoading(false);
    }
  };

  const handleProgramSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!programData.name) {
      setError("Please enter program name");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/program", programData);
      setSuccess("Program added successfully!");
      setProgramData({ name: "" });
      setShowProgramForm(false);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add program");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Attendance Dashboard</h1>
        <button onClick={logout} className="logout-button">Logout</button>
      </div>

      <div className="dashboard-layout">
        <div className="sidebar">
          <button 
            onClick={() => {
              setShowHome(true);
              setShowTeacherForm(false);
              setShowProgramForm(false);
              setShowSubjects(false);
              setShowAttendance(false);
              setShowUserForm(false);
              setShowCourseAllocation(false);
            }} 
            className="sidebar-button home-button"
          >
            Home
          </button>

          <button 
            onClick={() => {
              setShowUserForm(true);
              setShowHome(false);
              setShowTeacherForm(false);
              setShowProgramForm(false);
              setShowSubjects(false);
              setShowAttendance(false);
              setShowStudentForm(false);
              setShowCourseAllocation(false);
              if (!showUserForm) {
                fetchRoles();
                fetchUsers();
                fetchPrograms();
                fetchSemesters();
              }
            }} 
            className="sidebar-button"
          >
            Add User
          </button>

          <button 
            onClick={() => {
              setShowStudentForm(true);
              setShowHome(false);
              setShowTeacherForm(false);
              setShowProgramForm(false);
              setShowSubjects(false);
              setShowAttendance(false);
              setShowUserForm(false);
              setShowCourseAllocation(false);
              if (!showStudentForm) {
                fetchStudents();
                fetchPrograms();
                fetchSemesters();
              }
            }} 
            className="sidebar-button"
          >
            Add Student
          </button>

          <button 
            onClick={() => {
              setShowTeacherForm(true);
              setShowHome(false);
              setShowProgramForm(false);
              setShowSubjects(false);
              setShowAttendance(false);
              setShowUserForm(false);
              setShowStudentForm(false);
              setShowCourseAllocation(false);
            }} 
            className="sidebar-button"
          >
            Add Teacher
          </button>

          <button 
            onClick={() => {
              setShowProgramForm(true);
              setShowHome(false);
              setShowTeacherForm(false);
              setShowSubjects(false);
              setShowAttendance(false);
              setShowUserForm(false);
              setShowCourseAllocation(false);
            }} 
            className="sidebar-button"
          >
            Add Program
          </button>

          <button 
            onClick={() => {
              setShowSubjects(true);
              setShowHome(false);
              setShowTeacherForm(false);
              setShowProgramForm(false);
              setShowAttendance(false);
              setShowUserForm(false);
              setShowCourseAllocation(false);
              if (!showSubjects) {
                fetchSubjects();
                fetchPrograms();
                fetchSemesters();
                fetchTeachers();
              }
            }} 
            className="sidebar-button"
          >
            View Subjects
          </button>

          <button 
            onClick={() => {
              setShowAttendance(true);
              setShowHome(false);
              setShowTeacherForm(false);
              setShowProgramForm(false);
              setShowSubjects(false);
              setShowUserForm(false);
              setShowCourseAllocation(false);
              if (!showAttendance) {
                fetchAttendance();
                fetchPrograms();
                fetchSemesters();
              }
            }} 
            className="sidebar-button"
          >
            View Attendance
          </button>

          <button 
            onClick={() => {
              setShowCourseAllocation(true);
              setShowHome(false);
              setShowTeacherForm(false);
              setShowProgramForm(false);
              setShowSubjects(false);
              setShowAttendance(false);
              setShowUserForm(false);
              setShowStudentForm(false);
              if (!showCourseAllocation) {
                fetchFaculties();
                fetchSemesters();
                fetchSubjects();
                fetchTeachers();
                fetchAllocations();
              }
            }} 
            className="sidebar-button"
          >
            Allocate Course
          </button>
        </div>

        <div className="main-content">

        {showHome && (
          <div className="students-section">
            <h3>Student Attendance</h3>
            
            <div className="filter-container">
              <select
                value={homeSelectedProgram}
                onChange={(e) => setHomeSelectedProgram(e.target.value)}
                className="filter-select"
              >
                <option value="">All Programs</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </select>

              <select
                value={homeSelectedSemester}
                onChange={(e) => setHomeSelectedSemester(e.target.value)}
                className="filter-select"
              >
                <option value="">All Semesters</option>
                {semesters.map((semester) => (
                  <option key={semester.id} value={semester.id}>
                    {semester.number}
                  </option>
                ))}
              </select>

              <select
                value={homeSelectedSubject}
                onChange={(e) => setHomeSelectedSubject(e.target.value)}
                className="filter-select"
                style={{border: homeSelectedSubject ? '2px solid #10b981' : '2px solid #dc2626'}}
              >
                <option value="">Select Subject *</option>
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name} ({subject.code})
                  </option>
                ))}
              </select>
            </div>

            {!homeSelectedSubject && (
              <div className="subject-warning">
                <p>⚠️ Please select a subject to mark attendance</p>
              </div>
            )}

            {students.length > 0 ? (
              <div className="table-container">
                <table className="students-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Roll No</th>
                      <th>Program</th>
                      <th>Status</th>
                      <th>Attendance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students
                      .filter(student => {
                        const matchesProgram = !homeSelectedProgram || 
                          student.program?.id?.toString() === homeSelectedProgram;
                        
                        const matchesSemester = !homeSelectedSemester || 
                          student.semester?.id?.toString() === homeSelectedSemester;
                        
                        return matchesProgram && matchesSemester;
                      })
                      .map((student) => (
                        <tr key={student.id}>
                          <td>{student.name}</td>
                          <td>{student.rollNo}</td>
                          <td>{student.program?.name || 'N/A'}</td>
                          <td>
                            <span className={`status-badge ${student.status === 1 ? 'active' : 'inactive'}`}>
                              {student.status === 1 ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            <div className="attendance-buttons">
                              <button
                                onClick={() => markAttendance(student.id, 'present')}
                                disabled={attendanceLoading[student.id]}
                                className="attendance-btn present-btn"
                              >
                                Present
                              </button>
                              <button
                                onClick={() => markAttendance(student.id, 'absent')}
                                disabled={attendanceLoading[student.id]}
                                className="attendance-btn absent-btn"
                              >
                                Absent
                              </button>
                              <button
                                onClick={() => markAttendance(student.id, 'leave')}
                                disabled={attendanceLoading[student.id]}
                                className="attendance-btn leave-btn"
                              >
                                Leave
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-students">No students found</p>
            )}
          </div>
        )}

        {showTeacherForm && (
          <div className="form-card">
            <h3>Add Teacher Details</h3>
            <form onSubmit={handleTeacherSubmit} className="teacher-form">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Name"
                  value={teacherData.name}
                  onChange={(e) => setTeacherData({...teacherData, name: e.target.value})}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email"
                  value={teacherData.email}
                  onChange={(e) => setTeacherData({...teacherData, email: e.target.value})}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <select
                  value={teacherData.status}
                  onChange={(e) => setTeacherData({...teacherData, status: parseInt(e.target.value)})}
                  className="form-input"
                >
                  <option value={1}>Active (1)</option>
                  <option value={0}>Inactive (0)</option>
                </select>
              </div>

              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? "Adding..." : "Add Teacher"}
              </button>
            </form>

            <div className="teachers-table-section">
              <h4>Existing Teachers</h4>
              {teachers.length > 0 ? (
                <div className="table-container">
                  <table className="teachers-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Email</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teachers.map((teacher) => (
                        <tr key={teacher.id}>
                          <td>{teacher.fullName}</td>
                          <td>{teacher?.email || 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="no-teachers">No teachers found</p>
              )}
            </div>
          </div>
        )}

        {showUserForm && (
          <div className="user-section">
            <div className="form-card" style={{marginBottom: '2rem'}}>
              <h3>Add User Details</h3>
              <form onSubmit={handleUserSubmit} className="user-form">
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={userData.fullName}
                    onChange={(e) => setUserData({...userData, fullName: e.target.value})}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Username *"
                    value={userData.username}
                    onChange={(e) => setUserData({...userData, username: e.target.value})}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Email *"
                    value={userData.email}
                    onChange={(e) => setUserData({...userData, email: e.target.value})}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <input
                    type="password"
                    placeholder="Password *"
                    value={userData.password}
                    onChange={(e) => setUserData({...userData, password: e.target.value})}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Address"
                    value={userData.address}
                    onChange={(e) => setUserData({...userData, address: e.target.value})}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Contact"
                    value={userData.contact}
                    onChange={(e) => setUserData({...userData, contact: e.target.value})}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <select
                    value={userData.role}
                    onChange={(e) => {
                      console.log('Role selected:', e.target.value);
                      setUserData({...userData, role: e.target.value});
                    }}
                    className="form-input"
                  >
                    <option value="">Select Role *</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.code}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{padding: '10px', background: '#f0f0f0', margin: '10px 0'}}>
                  Debug: Current role = "{userData.role}"
                </div>

                {userData.role === 'STD' && (
                  <>
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Roll Number *"
                        value={userData.rollNo}
                        onChange={(e) => setUserData({...userData, rollNo: e.target.value})}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <select
                        value={userData.program}
                        onChange={(e) => setUserData({...userData, program: e.target.value})}
                        className="form-input"
                      >
                        <option value="">Select Program *</option>
                        {programs.map((program) => (
                          <option key={program.id} value={program.id}>
                            {program.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group">
                      <select
                        value={userData.semester}
                        onChange={(e) => setUserData({...userData, semester: e.target.value})}
                        className="form-input"
                      >
                        <option value="">Select Semester *</option>
                        {semesters.map((semester) => (
                          <option key={semester.id} value={semester.id}>
                            {semester.number}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? "Adding..." : "Add User"}
                </button>
              </form>
            </div>

            <div className="users-table-section">
              <h3>All Users</h3>
              {users.length > 0 ? (
                <div className="table-container">
                  <table className="users-table">
                    <thead>
                      <tr>
                        <th>Edit</th>
                        <th>Email</th>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={editingUsers[user.id] || false}
                              onChange={(e) => handleUserCheckbox(user.id, e.target.checked)}
                              className="edit-checkbox"
                            />
                          </td>
                          <td>
                            {editingUsers[user.id] ? (
                              <input
                                type="email"
                                value={editUserData[user.id]?.email || ''}
                                onChange={(e) => handleEditUserChange(user.id, 'email', e.target.value)}
                                className="edit-input"
                              />
                            ) : (
                              user.email
                            )}
                          </td>
                          <td>
                            {editingUsers[user.id] ? (
                              <input
                                type="text"
                                value={editUserData[user.id]?.username || ''}
                                onChange={(e) => handleEditUserChange(user.id, 'username', e.target.value)}
                                className="edit-input"
                              />
                            ) : (
                              user.username
                            )}
                          </td>
                          <td>
                            {editingUsers[user.id] ? (
                              <select
                                value={editUserData[user.id]?.role || ''}
                                onChange={(e) => handleEditUserChange(user.id, 'role', e.target.value)}
                                className="edit-select"
                              >
                                <option value="">Select Role</option>
                                {roles.map((role) => (
                                  <option key={role.id} value={role.code}>
                                    {role.name}
                                  </option>
                                ))}
                              </select>
                            ) : (
                              user.role?.name || 'N/A'
                            )}
                          </td>
                          <td>
                            <span className={`status-badge ${user.status ? 'active' : 'inactive'}`}>
                              {user.status ? 'Active' : 'Blocked'}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              {editingUsers[user.id] && (
                                <button
                                  onClick={() => handleUpdateUser(user.id)}
                                  disabled={loading}
                                  className="update-btn"
                                >
                                  {loading ? 'Updating...' : 'Update'}
                                </button>
                              )}
                              {user.status ? (
                                <button
                                  onClick={() => handleBlockUser(user.id)}
                                  disabled={loading}
                                  className="delete-btn"
                                >
                                  Block
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleUnblockUser(user.id)}
                                  disabled={loading}
                                  className="unblock-btn"
                                >
                                  Unblock
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="no-users">No users found</p>
              )}
            </div>
          </div>
        )}

        {showStudentForm && (
          <div className="student-section">
            <h3>All Students (Count: {students.length})</h3>
            <button 
              onClick={() => {
                console.log("Force refreshing students...");
                fetchStudents();
              }}
              className="submit-button"
              style={{marginBottom: '20px'}}
            >
              Refresh Students
            </button>
            <div className="table-container">
              <table className="students-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Roll No</th>
                    <th>Status</th>
                    <th>Program</th>
                    <th>Semester</th>
                    <th>Address</th>
                    <th>Contact</th>
                    <th>User ID</th>
                  </tr>
                </thead>
                <tbody>
                  {students.length > 0 ? (
                    students.map((student) => (
                      <tr key={student.id}>
                        <td>{student.name || 'N/A'}</td>
                        <td>{student.rollNo || 'N/A'}</td>
                        <td>
                          <span className={`status-badge ${student.status === 1 ? 'active' : 'inactive'}`}>
                            {student.status === 1 ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>{student.program?.name || 'N/A'}</td>
                        <td>{student.semester?.number || 'N/A'}</td>
                        <td>{student.address || 'N/A'}</td>
                        <td>{student.contact || 'N/A'}</td>
                        <td>{student.user?.id || 'N/A'}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" style={{textAlign: 'center', padding: '20px'}}>
                        {loading ? 'Loading students...' : 'No students found. Click Refresh or check console for errors.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showAttendance && (
          <div className="attendance-section">
            <h3>Attendance Records</h3>
            
            <div className="filter-container">
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                className="filter-select"
              >
                <option value="">All Programs</option>
                {programs.map((program) => (
                  <option key={program.id} value={program.id}>
                    {program.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="filter-select"
              >
                <option value="">All Semesters</option>
                {semesters.map((semester) => (
                  <option key={semester.id} value={semester.id}>
                    {semester.number}
                  </option>
                ))}
              </select>
            </div>

            <div className="search-container">
              <input
                type="text"
                placeholder="Search by student name, subject, or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            {attendance.length > 0 ? (
              <div className="table-container">
                <table className="attendance-table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Subject</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance
                      .filter(record => {
                        const matchesSearch = 
                          record.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.subject?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          record.date?.toString().includes(searchTerm);
                        
                        const matchesProgram = !selectedProgram || 
                          record.student?.program?.id?.toString() === selectedProgram;
                        
                        const matchesSemester = !selectedSemester || 
                          record.student?.semester?.id?.toString() === selectedSemester;
                        
                        return matchesSearch && matchesProgram && matchesSemester;
                      })
                      .map((record) => (
                        <tr key={record.id}>
                          <td>{record.student?.name || 'N/A'}</td>
                          <td>{record.subject?.name || 'N/A'}</td>
                          <td>{record.date || 'N/A'}</td>
                          <td>
                            <span className={`status-badge ${record.status === 'P' ? 'present' : record.status === 'A' ? 'absent' : 'leave'}`}>
                              {record.status === 'P' ? 'Present' : record.status === 'A' ? 'Absent' : record.status === 'L' ? 'Leave' : 'N/A'}
                            </span>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-attendance">No attendance records found</p>
            )}
          </div>
        )}

        {showProgramForm && (
          <div className="form-card">
            <h3>Add Program Details</h3>
            <form onSubmit={handleProgramSubmit} className="program-form">
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Program Name"
                  value={programData.name}
                  onChange={(e) => setProgramData({...programData, name: e.target.value})}
                  className="form-input"
                />
              </div>

              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? "Adding..." : "Add Program"}
              </button>
            </form>
          </div>
        )}

        {showSubjects && (
          <div className="subjects-section">
            <h3>Subject Details</h3>
            
            <div className="form-card" style={{marginBottom: '2rem'}}>
              <h4>Add New Subject</h4>
              <form onSubmit={handleSubjectSubmit} className="subject-form">
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Subject Name"
                    value={subjectData.name}
                    onChange={(e) => setSubjectData({...subjectData, name: e.target.value})}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Subject Code"
                    value={subjectData.code}
                    onChange={(e) => setSubjectData({...subjectData, code: e.target.value})}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <select
                    value={subjectData.program}
                    onChange={(e) => setSubjectData({...subjectData, program: e.target.value})}
                    className="form-input"
                  >
                    <option value="">Select Program</option>
                    {programs.map((program) => (
                      <option key={program.id} value={program.id}>
                        {program.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <select
                    value={subjectData.semester}
                    onChange={(e) => setSubjectData({...subjectData, semester: e.target.value})}
                    className="form-input"
                  >
                    <option value="">Select Semester</option>
                    {semesters.map((semester) => (
                      <option key={semester.id} value={semester.id}>
                        {semester.number}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <select
                    value={subjectData.teacher}
                    onChange={(e) => setSubjectData({...subjectData, teacher: e.target.value})}
                    className="form-input"
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? "Adding..." : "Add Subject"}
                </button>
              </form>
            </div>

            {subjects.length > 0 ? (
              <div className="table-container">
                <table className="subjects-table">
                  <thead>
                    <tr>
                      <th>Edit</th>
                      <th>Subject Name</th>
                      <th>Subject Code</th>
                      <th>Semester</th>
                      <th>Program</th>
                      <th>Teacher</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjects.map((subject) => (
                      <tr key={subject.id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={editingSubjects[subject.id] || false}
                            onChange={(e) => handleSubjectCheckbox(subject.id, e.target.checked)}
                            className="edit-checkbox"
                          />
                        </td>
                        <td>
                          {editingSubjects[subject.id] ? (
                            <input
                              type="text"
                              value={editSubjectData[subject.id]?.name || ''}
                              onChange={(e) => handleEditSubjectChange(subject.id, 'name', e.target.value)}
                              className="edit-input"
                            />
                          ) : (
                            subject.name
                          )}
                        </td>
                        <td>
                          {editingSubjects[subject.id] ? (
                            <input
                              type="text"
                              value={editSubjectData[subject.id]?.code || ''}
                              onChange={(e) => handleEditSubjectChange(subject.id, 'code', e.target.value)}
                              className="edit-input"
                            />
                          ) : (
                            subject.code
                          )}
                        </td>
                        <td>
                          {editingSubjects[subject.id] ? (
                            <select
                              value={editSubjectData[subject.id]?.semester || ''}
                              onChange={(e) => handleEditSubjectChange(subject.id, 'semester', e.target.value)}
                              className="edit-select"
                            >
                              <option value="">Select Semester</option>
                              {semesters.map((semester) => (
                                <option key={semester.id} value={semester.id}>
                                  {semester.number}
                                </option>
                              ))}
                            </select>
                          ) : (
                            subject.semester?.number || 'N/A'
                          )}
                        </td>
                        <td>
                          {editingSubjects[subject.id] ? (
                            <select
                              value={editSubjectData[subject.id]?.program || ''}
                              onChange={(e) => handleEditSubjectChange(subject.id, 'program', e.target.value)}
                              className="edit-select"
                            >
                              <option value="">Select Program</option>
                              {programs.map((program) => (
                                <option key={program.id} value={program.id}>
                                  {program.name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            subject.program?.name || 'N/A'
                          )}
                        </td>
                        <td>
                          {editingSubjects[subject.id] ? (
                            <select
                              value={editSubjectData[subject.id]?.teacher || ''}
                              onChange={(e) => handleEditSubjectChange(subject.id, 'teacher', e.target.value)}
                              className="edit-select"
                            >
                              <option value="">Select Teacher</option>
                              {teachers.map((teacher) => (
                                <option key={teacher.id} value={teacher.id}>
                                  {teacher.fullName}
                                </option>
                              ))}
                            </select>
                          ) : (
                            subject.teacher?.fullName || 'N/A'
                          )}
                        </td>
                        <td>
                          {editingSubjects[subject.id] && (
                            <button
                              onClick={() => handleUpdateSubject(subject.id)}
                              disabled={loading}
                              className="update-btn"
                            >
                              {loading ? 'Updating...' : 'Update'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="no-subjects">No subjects found</p>
            )}
          </div>
        )}

        {showCourseAllocation && (
          <div className="allocation-section">
            <div className="form-card" style={{marginBottom: '2rem'}}>
              <h3>Allocate Course</h3>
              <form onSubmit={handleCourseAllocationSubmit} className="allocation-form">
                <div className="form-group">
                  <select
                    value={allocationData.faculty}
                    onChange={(e) => setAllocationData({...allocationData, faculty: e.target.value})}
                    className="form-input"
                  >
                    <option value="">Select Faculty</option>
                    {faculties.map((faculty) => (
                      <option key={faculty.id} value={faculty.id}>
                        {faculty.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <select
                    value={allocationData.semester}
                    onChange={(e) => setAllocationData({...allocationData, semester: e.target.value})}
                    className="form-input"
                  >
                    <option value="">Select Semester</option>
                    {semesters.map((semester) => (
                      <option key={semester.id} value={semester.id}>
                        {semester.number}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <select
                    value={allocationData.subject}
                    onChange={(e) => setAllocationData({...allocationData, subject: e.target.value})}
                    className="form-input"
                  >
                    <option value="">Select Subject</option>
                    {subjects.map((subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name} ({subject.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <select
                    value={allocationData.teacher}
                    onChange={(e) => setAllocationData({...allocationData, teacher: e.target.value})}
                    className="form-input"
                  >
                    <option value="">Select Teacher</option>
                    {teachers.map((teacher) => (
                      <option key={teacher.id} value={teacher.id}>
                        {teacher.name}
                      </option>
                    ))}
                  </select>
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <button type="submit" className="submit-button" disabled={loading}>
                  {loading ? "Allocating..." : "Allocate Course"}
                </button>
              </form>
            </div>

            <div className="allocations-table-section">
              <h3>Course Allocations</h3>
              
              <div className="filter-container">
                <select
                  value={selectedAllocationFaculty}
                  onChange={(e) => setSelectedAllocationFaculty(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Faculties</option>
                  {faculties.map((faculty) => (
                    <option key={faculty.id} value={faculty.id}>
                      {faculty.name}
                    </option>
                  ))}
                </select>

                <select
                  value={selectedAllocationTeacher}
                  onChange={(e) => setSelectedAllocationTeacher(e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Teachers</option>
                  {teachers.map((teacher) => (
                    <option key={teacher.id} value={teacher.id}>
                      {teacher.fullName}
                    </option>
                  ))}
                </select>
              </div>

              {allocations.length > 0 ? (
                <div className="table-container">
                  <table className="allocations-table">
                    <thead>
                      <tr>
                        <th>Edit</th>
                        <th>Teacher</th>
                        <th>Faculty</th>
                        <th>Semester</th>
                        <th>Subject</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allocations
                        .filter(allocation => {
                          const matchesFaculty = !selectedAllocationFaculty || 
                            allocation.faculty?.id?.toString() === selectedAllocationFaculty;
                          
                          const matchesTeacher = !selectedAllocationTeacher || 
                            allocation.teacher?.id?.toString() === selectedAllocationTeacher;
                          
                          return matchesFaculty && matchesTeacher;
                        })
                        .map((allocation) => (
                          <tr key={allocation.id}>
                            <td>
                              <input
                                type="checkbox"
                                checked={editingAllocations[allocation.id] || false}
                                onChange={(e) => handleAllocationCheckbox(allocation.id, e.target.checked)}
                                className="edit-checkbox"
                              />
                            </td>
                            <td>
                              {editingAllocations[allocation.id] ? (
                                <select
                                  value={editAllocationData[allocation.id]?.teacher || ''}
                                  onChange={(e) => handleEditAllocationChange(allocation.id, 'teacher', e.target.value)}
                                  className="edit-select"
                                >
                                  <option value="">Select Teacher</option>
                                  {teachers.map((teacher) => (
                                    <option key={teacher.id} value={teacher.id}>
                                      {teacher.fullName}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                allocation.teacher?.fullName || 'N/A'
                              )}
                            </td>
                            <td>
                              {editingAllocations[allocation.id] ? (
                                <select
                                  value={editAllocationData[allocation.id]?.faculty || ''}
                                  onChange={(e) => handleEditAllocationChange(allocation.id, 'faculty', e.target.value)}
                                  className="edit-select"
                                >
                                  <option value="">Select Faculty</option>
                                  {faculties.map((faculty) => (
                                    <option key={faculty.id} value={faculty.id}>
                                      {faculty.name}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                allocation.faculty?.name || 'N/A'
                              )}
                            </td>
                            <td>
                              {editingAllocations[allocation.id] ? (
                                <select
                                  value={editAllocationData[allocation.id]?.semester || ''}
                                  onChange={(e) => handleEditAllocationChange(allocation.id, 'semester', e.target.value)}
                                  className="edit-select"
                                >
                                  <option value="">Select Semester</option>
                                  {semesters.map((semester) => (
                                    <option key={semester.id} value={semester.id}>
                                      {semester.number}
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                allocation.semester?.number || 'N/A'
                              )}
                            </td>
                            <td>
                              {editingAllocations[allocation.id] ? (
                                <select
                                  value={editAllocationData[allocation.id]?.subject || ''}
                                  onChange={(e) => handleEditAllocationChange(allocation.id, 'subject', e.target.value)}
                                  className="edit-select"
                                >
                                  <option value="">Select Subject</option>
                                  {subjects.map((subject) => (
                                    <option key={subject.id} value={subject.id}>
                                      {subject.name} ({subject.code})
                                    </option>
                                  ))}
                                </select>
                              ) : (
                                allocation.subject?.name || 'N/A'
                              )}
                            </td>
                            <td>
                              {editingAllocations[allocation.id] && (
                                <button
                                  onClick={() => handleUpdateAllocation(allocation.id)}
                                  disabled={loading}
                                  className="update-btn"
                                >
                                  {loading ? 'Updating...' : 'Update'}
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      }
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="no-allocations">No course allocations found</p>
              )}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
