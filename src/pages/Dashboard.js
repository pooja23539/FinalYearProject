import { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import api from "../api/axios";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const { logout, userRole } = useAuth();

  const isAdmin = userRole === 'user' || userRole === 'ADM';
  const isTeacher = userRole === 'TEA' || isAdmin; // Admins can also do teacher tasks
  const isStudent = userRole === 'STD';
  const isUser = userRole === 'USE';
  const isUserDashboard = userRole === 'user';
  const [showTeacherForm, setShowTeacherForm] = useState(false);
  const [showProgramForm, setShowProgramForm] = useState(false);
  const [showSubjects, setShowSubjects] = useState(false);
  const [showAttendance, setShowAttendance] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showStudentForm, setShowStudentForm] = useState(false);
  const [showCourseAllocation, setShowCourseAllocation] = useState(false);
  const [showHome, setShowHome] = useState(true);
  const [showReport, setShowReport] = useState(false);
  const [showAddUserForm, setShowAddUserForm] = useState(false);
  const [isAddingStudent, setIsAddingStudent] = useState(false);
  const [isAddingTeacher, setIsAddingTeacher] = useState(false);
  const [isAddingProgram, setIsAddingProgram] = useState(false);
  const [isAddingSubject, setIsAddingSubject] = useState(false);
  const [isAddingAllocation, setIsAddingAllocation] = useState(false);
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
  const [attendanceData, setAttendanceData] = useState({ student: "", subject: "", date: "", status: "" });
  const [isAddingAttendance, setIsAddingAttendance] = useState(false);
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
  const [editingPrograms, setEditingPrograms] = useState({});
  const [editProgramData, setEditProgramData] = useState({});
  const [editingTeachers, setEditingTeachers] = useState({});
  const [editTeacherData, setEditTeacherData] = useState({});
  const [editingAttendance, setEditingAttendance] = useState({});
  const [editAttendanceData, setEditAttendanceData] = useState({});
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
  const [currentStudent, setCurrentStudent] = useState(null);
  const [currentTeacher, setCurrentTeacher] = useState(null);
  const [studentHomeProgram, setStudentHomeProgram] = useState("");
  const [studentHomeSemester, setStudentHomeSemester] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [markAttendanceProgram, setMarkAttendanceProgram] = useState("");
  const [markAttendanceSemester, setMarkAttendanceSemester] = useState("");
  const [markAttendanceSubject, setMarkAttendanceSubject] = useState("");
  const [attendanceDashboardDate, setAttendanceDashboardDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceDashboardMode, setAttendanceDashboardMode] = useState(null); // 'view' or 'mark'
  const [dashboardProgram, setDashboardProgram] = useState("");
  const [dashboardSemester, setDashboardSemester] = useState("");
  const [dashboardSubject, setDashboardSubject] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [reportType, setReportType] = useState("daily"); // daily, weekly, monthly
  const [reportStartDate, setReportStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportEndDate, setReportEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [reportProgram, setReportProgram] = useState("");
  const [reportSemester, setReportSemester] = useState("");
  const [reportSubject, setReportSubject] = useState("");

  useEffect(() => {
    fetchStudents();
    fetchTeachers();
    fetchPrograms();
    fetchSemesters();
    fetchFaculties();
    fetchSubjects();
    fetchAttendance();
    if (isStudent) {
      fetchCurrentStudent();
      fetchAllStudentsForStudent();
    }
    if (isTeacher && !isAdmin) {
      fetchCurrentTeacher();
    }
  }, []);

  const fetchFaculties = async () => {
    try {
      const response = await api.get("/api/faculties");
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

  const fetchCurrentStudent = async () => {
    try {
      const response = await api.get("/api/student/current");
      console.log("Current student:", response.data);
      setCurrentStudent(response.data);
    } catch (err) {
      console.error("Failed to fetch current student:", err);
      console.error("Error details:", err.response?.data);
    }
  };

  const fetchCurrentTeacher = async () => {
    try {
      const response = await api.get("/api/teachers/current");
      console.log("Current teacher:", response.data);
      setCurrentTeacher(response.data);
    } catch (err) {
      console.error("Failed to fetch current teacher:", err);
      console.error("Error details:", err.response?.data);
    }
  };

  const fetchStudentsByProgramSemester = async () => {
    if (studentHomeProgram && studentHomeSemester) {
      try {
        const response = await api.get("/api/student/by-program-semester", {
          params: {
            programId: studentHomeProgram,
            semesterId: studentHomeSemester
          }
        });
        setFilteredStudents(response.data);
      } catch (err) {
        console.error("Failed to fetch students:", err);
      }
    } else {
      setFilteredStudents([]);
    }
  };

  const fetchAllStudentsForStudent = async () => {
    try {
      const response = await api.get("/api/student");
      setFilteredStudents(response.data);
    } catch (err) {
      console.error("Failed to fetch all students:", err);
    }
  };

  useEffect(() => {
    if (isStudent && studentHomeProgram && studentHomeSemester) {
      fetchStudentsByProgramSemester();
    }
  }, [studentHomeProgram, studentHomeSemester]);

  const computeAttendanceSummary = (records) => {
    const summary = { P: [], A: [], L: [] };
    records.forEach(r => {
      if (r.status === 'P') summary.P.push(r);
      else if (r.status === 'A') summary.A.push(r);
      else if (r.status === 'L') summary.L.push(r);
    });
    return summary;
  };

  const markAttendance = async (studentId, status) => {
    // Determine which subject ID to use based on context
    let subjectId = markAttendanceSubject || homeSelectedSubject;

    console.log('markAttendance called with:', { studentId, status, subjectId, markAttendanceSubject, homeSelectedSubject });

    if (!subjectId) {
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

      // Use attendanceDashboardDate if in dashboard mode, otherwise use current date
      const attendanceDate = attendanceDashboardMode ? attendanceDashboardDate : new Date().toISOString().split('T')[0];

      const payload = {
        date: attendanceDate,
        status: statusValue,
        student: { id: studentId },
        subject: { id: parseInt(subjectId) }
      };

      console.log('API call payload:', payload);

      const response = await api.post("/api/attendance", payload);
      console.log('API response:', response);

      setSuccess(`Attendance marked as ${status}!`);
      setTimeout(() => setSuccess(""), 3000);
      fetchAttendance();
    } catch (err) {
      console.error('API Error:', err);
      setError(err.response?.data?.message || `Failed to mark ${status}`);
      setTimeout(() => setError(""), 3000);
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
      await api.post("/api/teachers", {
        fullName: teacherData.name,
        email: teacherData.email,
        contact: "",
        status: teacherData.status
      });
      setSuccess("Teacher added successfully!");
      setTeacherData({ name: "", email: "", status: 1 });
      await fetchTeachers();
      setIsAddingTeacher(false);
      setTimeout(() => setSuccess(""), 3000);
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
      setIsAddingAllocation(false);
      setTimeout(() => setSuccess(""), 3000);
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
      setIsAddingStudent(false);
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
      } else if (userData.role === 'TEA') {
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
      await fetchUsers();
      setShowAddUserForm(false);
      setTimeout(() => setSuccess(""), 3000);
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
      setIsAddingSubject(false);
      setTimeout(() => setSuccess(""), 3000);
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
      await fetchPrograms();
      setIsAddingProgram(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add program");
    } finally {
      setLoading(false);
    }
  };

  const handleProgramCheckbox = (programId, isChecked) => {
    setEditingPrograms(prev => ({
      ...prev,
      [programId]: isChecked
    }));

    if (isChecked) {
      const program = programs.find(p => p.id === programId);
      setEditProgramData(prev => ({
        ...prev,
        [programId]: {
          name: program.name
        }
      }));
    }
  };

  const handleEditProgramChange = (programId, value) => {
    setEditProgramData(prev => ({
      ...prev,
      [programId]: {
        name: value
      }
    }));
  };

  const handleUpdateProgram = async (programId) => {
    try {
      setLoading(true);
      const data = editProgramData[programId];
      await api.put(`/api/program/${programId}`, {
        name: data.name
      });
      setSuccess("Program updated successfully!");
      setEditingPrograms(prev => ({ ...prev, [programId]: false }));
      fetchPrograms();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update program");
    } finally {
      setLoading(false);
    }
  };

  const handleTeacherCheckbox = (teacherId, isChecked) => {
    setEditingTeachers(prev => ({
      ...prev,
      [teacherId]: isChecked
    }));

    if (isChecked) {
      const teacher = teachers.find(t => t.id === teacherId);
      setEditTeacherData(prev => ({
        ...prev,
        [teacherId]: {
          fullName: teacher.fullName,
          email: teacher.email
        }
      }));
    }
  };

  const handleEditTeacherChange = (teacherId, field, value) => {
    setEditTeacherData(prev => ({
      ...prev,
      [teacherId]: {
        ...prev[teacherId],
        [field]: value
      }
    }));
  };

  const handleUpdateTeacher = async (teacherId) => {
    try {
      setLoading(true);
      const data = editTeacherData[teacherId];
      const teacher = teachers.find(t => t.id === teacherId);
      await api.put(`/api/teachers/${teacherId}`, {
        fullName: data.fullName,
        email: data.email,
        contact: teacher.contact || '',
        status: teacher.status
      });
      setSuccess("Teacher updated successfully!");
      setEditingTeachers(prev => ({ ...prev, [teacherId]: false }));
      fetchTeachers();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update teacher");
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!attendanceData.student || !attendanceData.subject || !attendanceData.date || !attendanceData.status) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await api.post("/api/attendance", {
        student: { id: parseInt(attendanceData.student) },
        subject: { id: parseInt(attendanceData.subject) },
        date: attendanceData.date,
        status: attendanceData.status
      });
      setSuccess("Attendance added successfully!");
      setAttendanceData({ student: "", subject: "", date: "", status: "" });
      fetchAttendance();
      setIsAddingAttendance(false);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleAttendanceCheckbox = (attendanceId, isChecked) => {
    setEditingAttendance(prev => ({
      ...prev,
      [attendanceId]: isChecked
    }));

    if (isChecked) {
      const record = attendance.find(a => a.id === attendanceId);
      setEditAttendanceData(prev => ({
        ...prev,
        [attendanceId]: {
          student: record.student?.id || '',
          subject: record.subject?.id || '',
          date: record.date || '',
          status: record.status || ''
        }
      }));
    } else {
      // Clear edit data when unchecked
      setEditAttendanceData(prev => {
        const newData = { ...prev };
        delete newData[attendanceId];
        return newData;
      });
    }
  };

  const handleEditAttendanceChange = (attendanceId, field, value) => {
    setEditAttendanceData(prev => ({
      ...prev,
      [attendanceId]: {
        ...prev[attendanceId],
        [field]: value
      }
    }));
  };

  const handleUpdateAttendance = async (attendanceId) => {
    try {
      setLoading(true);
      const data = editAttendanceData[attendanceId];
      
      // Ensure all required fields are present
      if (!data.student || !data.subject || !data.date || !data.status) {
        setError("Please fill all fields");
        setLoading(false);
        return;
      }

      await api.put(`/api/attendance/${attendanceId}`, {
        date: data.date,
        status: data.status,
        student: { id: parseInt(data.student) },
        subject: { id: parseInt(data.subject) }
      });
      
      setSuccess("Attendance updated successfully!");
      setEditingAttendance(prev => ({ ...prev, [attendanceId]: false }));
      fetchAttendance();
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update attendance");
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check if attendance is already marked for a student on a date
  const isAttendanceAlreadyMarked = (studentId, subjectId, date) => {
    return attendance.some(record =>
      record.student?.id === studentId &&
      record.subject?.id === parseInt(subjectId) &&
      record.date === date
    );
  };

  // Helper function to get existing attendance record for update
  const getExistingAttendanceRecord = (studentId, subjectId, date) => {
    return attendance.find(record =>
      record.student?.id === studentId &&
      record.subject?.id === parseInt(subjectId) &&
      record.date === date
    );
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
              setShowReport(false);
              setMarkAttendanceProgram("");
              setMarkAttendanceSemester("");
              setMarkAttendanceSubject("");
            }}
            className="sidebar-button home-button"
          >
            Home
          </button>

          {isStudent && (
            <button
              onClick={() => {
                setShowReport(true);
                setShowHome(false);
                setShowTeacherForm(false);
                setShowProgramForm(false);
                setShowSubjects(false);
                setShowAttendance(false);
                setShowUserForm(false);
                setShowStudentForm(false);
                setShowCourseAllocation(false);
                setMarkAttendanceProgram("");
                setMarkAttendanceSemester("");
                setMarkAttendanceSubject("");
              }}
              className="sidebar-button"
            >
              View Report
            </button>
          )}

          {isAdmin && (
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
                setShowAddUserForm(false);
                if (!showUserForm) {
                  fetchRoles();
                  fetchUsers();
                  fetchPrograms();
                  fetchSemesters();
                }
              }}
              className="sidebar-button"
            >
              Manage Users
            </button>
          )}



          {isAdmin && (
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
                if (!showTeacherForm) {
                  fetchTeachers();
                  setIsAddingTeacher(false);
                }
              }}
              className="sidebar-button"
            >
              Add Teacher
            </button>
          )}

          {isAdmin && (
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
                  setIsAddingStudent(false);
                }
              }}
              className="sidebar-button"
            >
              Add Student
            </button>
          )}

          {isUserDashboard && (
            <div className="sidebar-group">
              <button
                onClick={() => {
                  setShowSubjects(true);
                  setShowHome(false);
                  setShowTeacherForm(false);
                  setShowProgramForm(false);
                  setShowAttendance(false);
                  setShowUserForm(false);
                  setShowCourseAllocation(false);
                  setIsAddingSubject(false);
                  if (!showSubjects) {
                    fetchSubjects();
                    fetchPrograms();
                    fetchSemesters();
                    fetchTeachers();
                  }
                }}
                className="sidebar-button"
              >
                Add Subject
              </button>
            </div>
          )}

          {isAdmin && (
            <button
              onClick={() => {
                setShowProgramForm(true);
                setShowHome(false);
                setShowTeacherForm(false);
                setShowSubjects(false);
                setShowAttendance(false);
                setShowUserForm(false);
                setShowCourseAllocation(false);
                setIsAddingProgram(false);
                if (!showProgramForm) {
                  fetchPrograms();
                }
              }}
              className="sidebar-button"
            >
              Add Program
            </button>
          )}

          {!isStudent && !isTeacher && (
            <button
              onClick={() => {
                setShowSubjects(true);
                setShowHome(false);
                setShowTeacherForm(false);
                setShowProgramForm(false);
                setShowAttendance(false);
                setShowUserForm(false);
                setShowCourseAllocation(false);
                setIsAddingSubject(false);
                if (!showSubjects) {
                  fetchSubjects();
                  fetchPrograms();
                  fetchSemesters();
                  fetchTeachers();
                }
              }}
              className="sidebar-button"
            >
              Manage Subjects
            </button>
          )}

          {isTeacher && !isAdmin && (
            <button
              onClick={() => {
                setShowReport(true);
                setShowHome(false);
                setShowTeacherForm(false);
                setShowProgramForm(false);
                setShowSubjects(false);
                setShowAttendance(false);
                setShowUserForm(false);
                setShowStudentForm(false);
                setShowCourseAllocation(false);
                setMarkAttendanceProgram("");
                setMarkAttendanceSemester("");
                setMarkAttendanceSubject("");
              }}
              className="sidebar-button"
            >
              Generate Report
            </button>
          )}

          <button
            onClick={() => {
              setShowAttendance(true);
              setShowHome(false);
              setShowTeacherForm(false);
              setShowProgramForm(false);
              setShowSubjects(false);
              setShowUserForm(false);
              setShowCourseAllocation(false);
              setShowStudentForm(false);
              setMarkAttendanceProgram("");
              setMarkAttendanceSemester("");
              setMarkAttendanceSubject("");
              if (!showAttendance) {
                fetchAttendance();
                fetchPrograms();
                fetchSemesters();
              }
            }}
            className="sidebar-button"
          >
            {isStudent ? 'View Attendance' : isTeacher && !isAdmin ? 'Mark Attendance' : 'Manage Attendance'}
          </button>

          {isAdmin && (
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
                setIsAddingAllocation(false);
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
          )}
        </div>

        <div className="main-content">

          {showHome && (
            <div className="students-section">
              {isStudent ? (
                <>
                  <h3>Student Details</h3>
                  <div className="filter-container" style={{ marginBottom: '20px' }}>
                    <select
                      value={studentHomeProgram}
                      onChange={(e) => setStudentHomeProgram(e.target.value)}
                      className="filter-select"
                    >
                      <option value="">Select Program</option>
                      {programs.map((program) => (
                        <option key={program.id} value={program.id}>
                          {program.name}
                        </option>
                      ))}
                    </select>

                    <select
                      value={studentHomeSemester}
                      onChange={(e) => setStudentHomeSemester(e.target.value)}
                      className="filter-select"
                    >
                      <option value="">Select Semester</option>
                      {semesters.map((semester) => (
                        <option key={semester.id} value={semester.id}>
                          {semester.number}
                        </option>
                      ))}
                    </select>
                  </div>

                  {filteredStudents.length > 0 ? (
                    <div className="table-container">
                      <table className="students-table">
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Roll No</th>
                            <th>Contact</th>
                            <th>Address</th>
                            <th>Program</th>
                            <th>Semester</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredStudents.map((student) => (
                            <tr key={student.id}>
                              <td>{student.name}</td>
                              <td>{student.rollNo}</td>
                              <td>{student.contact || 'N/A'}</td>
                              <td>{student.address || 'N/A'}</td>
                              <td>{student.program?.name || 'N/A'}</td>
                              <td>{student.semester?.number || 'N/A'}</td>
                              <td>
                                <span className={`status-badge ${student.status === 1 ? 'active' : 'inactive'}`}>
                                  {student.status === 1 ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="no-students">No students found</p>
                  )}
                </>
              ) : isTeacher && !isAdmin ? (
                <>
                  <h3>Teacher Details</h3>
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
                      style={{ border: homeSelectedSubject ? '2px solid #10b981' : '2px solid #dc2626' }}
                    >
                      <option value="">Select Subject *</option>
                      {subjects.map((subject) => (
                        <option key={subject.id} value={subject.id}>
                          {subject.name} ({subject.code})
                        </option>
                      ))}
                    </select>
                  </div>

                  {teachers.length > 0 ? (
                    <div className="table-container">
                      <table className="students-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Full Name</th>
                            <th>Email</th>
                            <th>Contact</th>
                            <th>Address</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {teachers.map((teacher) => (
                            <tr key={teacher.id}>
                              <td>{teacher.id}</td>
                              <td>{teacher.fullName}</td>
                              <td>{teacher.email || 'N/A'}</td>
                              <td>{teacher.contact || 'N/A'}</td>
                              <td>{teacher.address || 'N/A'}</td>
                              <td>
                                <span className={`status-badge ${teacher.status === 1 ? 'active' : 'inactive'}`}>
                                  {teacher.status === 1 ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="no-students">No teachers found</p>
                  )}
                </>
              ) : (
                <>
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
                      style={{ border: homeSelectedSubject ? '2px solid #10b981' : '2px solid #dc2626' }}
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
                    <div className="subject-warning" style={{
                      backgroundColor: '#fff3cd',
                      border: '2px solid #ffc107',
                      borderRadius: '8px',
                      padding: '15px 20px',
                      marginBottom: '20px',
                      maxWidth: '600px',
                      margin: '0 auto 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px'
                    }}>
                      <span style={{ fontSize: '24px' }}>⚠️</span>
                      <p style={{ margin: 0, color: '#856404', fontWeight: '500', fontSize: '16px' }}>Please select a subject to mark attendance</p>
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
                              </tr>
                            ))
                          }
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="no-students">No students found</p>
                  )}
                </>
              )}
            </div>
          )}

          {showTeacherForm && (
            <div className="teacher-section">
              {!isAddingTeacher ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3>All Teachers (Count: {teachers.length})</h3>
                    <button
                      onClick={() => setIsAddingTeacher(true)}
                      className="submit-button"
                    >
                      Add New Teacher
                    </button>
                  </div>
                  {success && <div className="success-message">{success}</div>}
                  {teachers.length > 0 ? (
                    <div className="table-container">
                      <table className="teachers-table">
                        <thead>
                          <tr>
                            <th>Edit</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Contact</th>
                            <th>Address</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {teachers.map((teacher) => (
                            <tr key={teacher.id}>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={editingTeachers[teacher.id] || false}
                                  onChange={(e) => handleTeacherCheckbox(teacher.id, e.target.checked)}
                                  className="edit-checkbox"
                                />
                              </td>
                              <td>
                                {editingTeachers[teacher.id] ? (
                                  <input
                                    type="text"
                                    value={editTeacherData[teacher.id]?.fullName || ''}
                                    onChange={(e) => handleEditTeacherChange(teacher.id, 'fullName', e.target.value)}
                                    className="edit-input"
                                  />
                                ) : (
                                  teacher.fullName
                                )}
                              </td>
                              <td>
                                {editingTeachers[teacher.id] ? (
                                  <input
                                    type="email"
                                    value={editTeacherData[teacher.id]?.email || ''}
                                    onChange={(e) => handleEditTeacherChange(teacher.id, 'email', e.target.value)}
                                    className="edit-input"
                                  />
                                ) : (
                                  teacher?.email || 'N/A'
                                )}
                              </td>
                              <td>{teacher.contact || 'N/A'}</td>
                              <td>{teacher.address || 'N/A'}</td>
                              <td>
                                <span className={`status-badge ${teacher.status === 1 ? 'active' : 'inactive'}`}>
                                  {teacher.status === 1 ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td>
                                {editingTeachers[teacher.id] && (
                                  <button
                                    onClick={() => handleUpdateTeacher(teacher.id)}
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
                    <p className="no-teachers">No teachers found</p>
                  )}
                </>
              ) : (
                <div className="form-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3>Add Teacher Details</h3>
                    <button
                      onClick={() => setIsAddingTeacher(false)}
                      className="logout-button"
                      style={{ padding: '5px 10px', fontSize: '12px' }}
                    >
                      Cancel
                    </button>
                  </div>
                  <form onSubmit={handleTeacherSubmit} className="teacher-form" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Name"
                        value={teacherData.name}
                        onChange={(e) => setTeacherData({ ...teacherData, name: e.target.value })}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <input
                        type="email"
                        placeholder="Email"
                        value={teacherData.email}
                        onChange={(e) => setTeacherData({ ...teacherData, email: e.target.value })}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <select
                        value={teacherData.status}
                        onChange={(e) => setTeacherData({ ...teacherData, status: parseInt(e.target.value) })}
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
                </div>
              )}
            </div>
          )}

          {showUserForm && (
            <div className="user-section">
              {!showAddUserForm ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3>All Users</h3>
                    <button
                      onClick={() => setShowAddUserForm(true)}
                      className="submit-button"
                    >
                      Add New User
                    </button>
                  </div>
                  {success && <div className="success-message">{success}</div>}
                  {users.length > 0 ? (
                    <div className="table-container">
                      <table className="users-table">
                        <thead>
                          <tr>
                            <th>Edit</th>
                            <th>Email</th>
                            <th>Username</th>
                            <th>Password</th>
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
                                {user.password || 'N/A'}
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
                </>
              ) : (
                <div className="form-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3>Add User Details</h3>
                    <button
                      onClick={() => setShowAddUserForm(false)}
                      className="logout-button"
                      style={{ padding: '5px 10px', fontSize: '12px' }}
                    >
                      Cancel
                    </button>
                  </div>
                  <form onSubmit={handleUserSubmit} className="user-form" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Full Name *"
                        value={userData.fullName}
                        onChange={(e) => setUserData({ ...userData, fullName: e.target.value })}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Username *"
                        value={userData.username}
                        onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <input
                        type="email"
                        placeholder="Email *"
                        value={userData.email}
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <input
                        type="password"
                        placeholder="Password *"
                        value={userData.password}
                        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Address"
                        value={userData.address}
                        onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Contact"
                        value={userData.contact}
                        onChange={(e) => setUserData({ ...userData, contact: e.target.value })}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <select
                        value={userData.role}
                        onChange={(e) => {
                          console.log('Role selected:', e.target.value);
                          setUserData({ ...userData, role: e.target.value });
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
                    {userData.role === 'STD' && (
                      <>
                        <div className="form-group">
                          <input
                            type="text"
                            placeholder="Roll Number *"
                            value={userData.rollNo}
                            onChange={(e) => setUserData({ ...userData, rollNo: e.target.value })}
                            className="form-input"
                          />
                        </div>

                        <div className="form-group">
                          <select
                            value={userData.program}
                            onChange={(e) => setUserData({ ...userData, program: e.target.value })}
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
                            onChange={(e) => setUserData({ ...userData, semester: e.target.value })}
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
              )}
            </div>
          )}

          {showStudentForm && (
            <div className="student-section">
              {!isAddingStudent ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3>All Students (Count: {students.length})</h3>
                    <button
                      onClick={() => setIsAddingStudent(true)}
                      className="submit-button"
                    >
                      Add New Student
                    </button>
                  </div>
                  {success && <div className="success-message">{success}</div>}
                  <div className="table-container">
                    <table className="students-table">
                      <thead>
                        <tr>
                          <th>Edit</th>
                          <th>Name</th>
                          <th>Roll No</th>
                          <th>Status</th>
                          <th>Program</th>
                          <th>Semester</th>
                          <th>Address</th>
                          <th>Contact</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {students.length > 0 ? (
                          students.map((student) => (
                            <tr key={student.id}>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={editingStudents[student.id] || false}
                                  onChange={(e) => handleStudentCheckbox(student.id, e.target.checked)}
                                  className="edit-checkbox"
                                />
                              </td>
                              <td>
                                {editingStudents[student.id] ? (
                                  <input
                                    type="text"
                                    value={editStudentData[student.id]?.name || ''}
                                    onChange={(e) => handleEditStudentChange(student.id, 'name', e.target.value)}
                                    className="edit-input"
                                  />
                                ) : (
                                  student.name || 'N/A'
                                )}
                              </td>
                              <td>
                                {editingStudents[student.id] ? (
                                  <input
                                    type="text"
                                    value={editStudentData[student.id]?.rollNo || ''}
                                    onChange={(e) => handleEditStudentChange(student.id, 'rollNo', e.target.value)}
                                    className="edit-input"
                                  />
                                ) : (
                                  student.rollNo || 'N/A'
                                )}
                              </td>
                              <td>
                                <span className={`status-badge ${student.status === 1 ? 'active' : 'inactive'}`}>
                                  {student.status === 1 ? 'Active' : 'Inactive'}
                                </span>
                              </td>
                              <td>
                                {editingStudents[student.id] ? (
                                  <select
                                    value={editStudentData[student.id]?.program || ''}
                                    onChange={(e) => handleEditStudentChange(student.id, 'program', e.target.value)}
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
                                  student.program?.name || 'N/A'
                                )}
                              </td>
                              <td>
                                {editingStudents[student.id] ? (
                                  <select
                                    value={editStudentData[student.id]?.semester || ''}
                                    onChange={(e) => handleEditStudentChange(student.id, 'semester', e.target.value)}
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
                                  student.semester?.number || 'N/A'
                                )}
                              </td>
                              <td>{student.address || 'N/A'}</td>
                              <td>{student.contact || 'N/A'}</td>
                              <td>
                                {editingStudents[student.id] && (
                                  <button
                                    onClick={() => handleUpdateStudent(student.id)}
                                    disabled={loading}
                                    className="update-btn"
                                  >
                                    {loading ? 'Updating...' : 'Update'}
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>
                              {loading ? 'Loading students...' : 'No students found.'}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div className="form-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3>Add Student Details</h3>
                    <button
                      onClick={() => setIsAddingStudent(false)}
                      className="logout-button"
                      style={{ padding: '5px 10px', fontSize: '12px' }}
                    >
                      Cancel
                    </button>
                  </div>
                  <form onSubmit={handleStudentSubmit} className="teacher-form" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Name"
                        value={studentData.name}
                        onChange={(e) => setStudentData({ ...studentData, name: e.target.value })}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Roll No"
                        value={studentData.rollNo}
                        onChange={(e) => setStudentData({ ...studentData, rollNo: e.target.value })}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <select
                        value={studentData.program}
                        onChange={(e) => setStudentData({ ...studentData, program: e.target.value })}
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
                        value={studentData.semester}
                        onChange={(e) => setStudentData({ ...studentData, semester: e.target.value })}
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
                        value={studentData.status}
                        onChange={(e) => setStudentData({ ...studentData, status: parseInt(e.target.value) })}
                        className="form-input"
                      >
                        <option value={1}>Active</option>
                        <option value={0}>Inactive</option>
                      </select>
                    </div>

                    {error && <div className="error-message">{error}</div>}
                    {success && <div className="success-message">{success}</div>}

                    <button type="submit" className="submit-button" disabled={loading}>
                      {loading ? "Adding..." : "Add Student"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {showAttendance && !showReport && (
            <div className="attendance-section">
              {/* Messages Display */}
              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              {/* Attendance Dashboard */}
              <div className="attendance-dashboard">
                <h3>Attendance Dashboard</h3>
                
                <div className="dashboard-controls">
                  <div className="date-picker-container">
                    <label>Select Date:</label>
                    <input
                      type="date"
                      value={attendanceDashboardDate}
                      onChange={(e) => setAttendanceDashboardDate(e.target.value)}
                      className="date-picker"
                    />
                  </div>

                  <div className="dashboard-buttons">
                    <button
                      onClick={() => setAttendanceDashboardMode('view')}
                      className={`dashboard-mode-btn ${attendanceDashboardMode === 'view' ? 'active' : ''}`}
                    >
                      View Attendance
                    </button>
                    {(isTeacher || isAdmin) && (
                      <button
                        onClick={() => setAttendanceDashboardMode('mark')}
                        className={`dashboard-mode-btn ${attendanceDashboardMode === 'mark' ? 'active' : ''}`}
                      >
                        Mark Attendance
                      </button>
                    )}
                  </div>
                </div>

                {attendanceDashboardMode === 'view' && (
                  <div className="view-attendance-section">
                    <h4>View Attendance for {attendanceDashboardDate}</h4>
                    <div className="filter-container">
                      <select
                        value={dashboardProgram}
                        onChange={(e) => setDashboardProgram(e.target.value)}
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
                        value={dashboardSemester}
                        onChange={(e) => setDashboardSemester(e.target.value)}
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
                        value={dashboardSubject}
                        onChange={(e) => setDashboardSubject(e.target.value)}
                        className="filter-select"
                      >
                        <option value="">All Subjects</option>
                        {subjects.map((subject) => (
                          <option key={subject.id} value={subject.id}>
                            {subject.name} ({subject.code})
                          </option>
                        ))}
                      </select>
                    </div>

                    {attendance.filter(record => 
                      record.date === attendanceDashboardDate &&
                      (!dashboardProgram || record.student?.program?.id?.toString() === dashboardProgram) &&
                      (!dashboardSemester || record.student?.semester?.id?.toString() === dashboardSemester) &&
                      (!dashboardSubject || record.subject?.id?.toString() === dashboardSubject)
                    ).length > 0 ? (
                      (() => {
                        const filtered = attendance.filter(record => 
                          record.date === attendanceDashboardDate &&
                          (!dashboardProgram || record.student?.program?.id?.toString() === dashboardProgram) &&
                          (!dashboardSemester || record.student?.semester?.id?.toString() === dashboardSemester) &&
                          (!dashboardSubject || record.subject?.id?.toString() === dashboardSubject)
                        );
                        const summary = computeAttendanceSummary(filtered);
                        return (
                          <>
                            <div className="table-container">
                              <table className="attendance-table">
                                <thead>
                                  <tr>
                                    {isTeacher && <th>Edit</th>}
                                    <th>Student Name</th>
                                    <th>Roll No</th>
                                    <th>Subject</th>
                                    <th>Status</th>
                                    {isTeacher && <th>Action</th>}
                                  </tr>
                                </thead>
                                <tbody>
                                  {filtered.map((record) => (
                                    <tr key={record.id}>
                                      {isTeacher && (
                                        <td>
                                          <input
                                            type="checkbox"
                                            checked={editingAttendance[record.id] || false}
                                            onChange={(e) => handleAttendanceCheckbox(record.id, e.target.checked)}
                                            className="edit-checkbox"
                                          />
                                        </td>
                                      )}
                                      <td>{record.student?.name || 'N/A'}</td>
                                      <td>{record.student?.rollNo || 'N/A'}</td>
                                      <td>{record.subject?.name || 'N/A'}</td>
                                      <td>
                                        {editingAttendance[record.id] && isTeacher ? (
                                          <select
                                            value={editAttendanceData[record.id]?.status || ''}
                                            onChange={(e) => handleEditAttendanceChange(record.id, 'status', e.target.value)}
                                            className="edit-select"
                                          >
                                            <option value="">Select Status</option>
                                            <option value="P">Present</option>
                                            <option value="A">Absent</option>
                                            <option value="L">Leave</option>
                                          </select>
                                        ) : (
                                          <span className={`status-badge ${record.status === 'P' ? 'present' : record.status === 'A' ? 'absent' : 'leave'}`}>
                                            {record.status === 'P' ? 'Present' : record.status === 'A' ? 'Absent' : record.status === 'L' ? 'Leave' : 'N/A'}
                                          </span>
                                        )}
                                      </td>
                                      {isTeacher && (
                                        <td>
                                          {editingAttendance[record.id] && (
                                            <button
                                              onClick={() => handleUpdateAttendance(record.id)}
                                              disabled={loading}
                                              className="update-btn"
                                            >
                                              {loading ? 'Updating...' : 'Update'}
                                            </button>
                                          )}
                                        </td>
                                      )}
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>

                            {/* summary table showing students by status */}
                            <div className="summary-container">
                              <h5>Attendance Summary</h5>
                              <table className="summary-table">
                                <thead>
                                  <tr>
                                    <th>Present</th>
                                    <th>Absent</th>
                                    <th>Leave</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>
                                      {summary.P.map(rec => (
                                        <div key={rec.id}>{rec.student?.name || 'N/A'}</div>
                                      ))}
                                    </td>
                                    <td>
                                      {summary.A.map(rec => (
                                        <div key={rec.id}>{rec.student?.name || 'N/A'}</div>
                                      ))}
                                    </td>
                                    <td>
                                      {summary.L.map(rec => (
                                        <div key={rec.id}>{rec.student?.name || 'N/A'}</div>
                                      ))}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </>
                        );
                      })()
                    ) : (
                      <div className="table-container">
                        <table className="attendance-table">
                          <thead>
                            <tr>
                              {isTeacher && <th>Edit</th>}
                              <th>Student Name</th>
                              <th>Roll No</th>
                              <th>Subject</th>
                              <th>Status</th>
                              {isTeacher && <th>Action</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {attendance
                              .filter(record => 
                                record.date === attendanceDashboardDate &&
                                (!dashboardProgram || record.student?.program?.id?.toString() === dashboardProgram) &&
                                (!dashboardSemester || record.student?.semester?.id?.toString() === dashboardSemester) &&
                                (!dashboardSubject || record.subject?.id?.toString() === dashboardSubject)
                              )
                              .map((record) => (
                                <tr key={record.id}>
                                  {isTeacher && (
                                    <td>
                                      <input
                                        type="checkbox"
                                        checked={editingAttendance[record.id] || false}
                                        onChange={(e) => handleAttendanceCheckbox(record.id, e.target.checked)}
                                        className="edit-checkbox"
                                      />
                                    </td>
                                  )}
                                  <td>{record.student?.name || 'N/A'}</td>
                                  <td>{record.student?.rollNo || 'N/A'}</td>
                                  <td>{record.subject?.name || 'N/A'}</td>
                                  <td>
                                    {editingAttendance[record.id] && isTeacher ? (
                                      <select
                                        value={editAttendanceData[record.id]?.status || ''}
                                        onChange={(e) => handleEditAttendanceChange(record.id, 'status', e.target.value)}
                                        className="edit-select"
                                      >
                                        <option value="">Select Status</option>
                                        <option value="P">Present</option>
                                        <option value="A">Absent</option>
                                        <option value="L">Leave</option>
                                      </select>
                                    ) : (
                                      <span className={`status-badge ${record.status === 'P' ? 'present' : record.status === 'A' ? 'absent' : 'leave'}`}>
                                        {record.status === 'P' ? 'Present' : record.status === 'A' ? 'Absent' : record.status === 'L' ? 'Leave' : 'N/A'}
                                      </span>
                                    )}
                                  </td>
                                  {isTeacher && (
                                    <td>
                                      {editingAttendance[record.id] && (
                                        <button
                                          onClick={() => handleUpdateAttendance(record.id)}
                                          disabled={loading}
                                          className="update-btn"
                                        >
                                          {loading ? 'Updating...' : 'Update'}
                                        </button>
                                      )}
                                    </td>
                                  )}
                                </tr>
                              ))
                            }
                          </tbody>
                        </table>
                      </div>
                    )  (
                      <p className="no-attendance">No attendance records found for {attendanceDashboardDate}</p>
                    )}
                  </div>
                )}

                {attendanceDashboardMode === 'mark' && (isTeacher || isAdmin) && (
                  <div className="mark-attendance-section">
                    <h4>Mark Attendance for {attendanceDashboardDate}</h4>
                    <div className="filter-container">
                      <div className="filter-group">
                        <label className="filter-label">Program</label>
                        <select
                          value={markAttendanceProgram}
                          onChange={(e) => setMarkAttendanceProgram(e.target.value)}
                          className="filter-select"
                        >
                          <option value="">Select Program</option>
                          {programs.map((program) => (
                            <option key={program.id} value={program.id}>
                              {program.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="filter-group">
                        <label className="filter-label">Semester</label>
                        <select
                          value={markAttendanceSemester}
                          onChange={(e) => setMarkAttendanceSemester(e.target.value)}
                          className="filter-select"
                        >
                          <option value="">Select Semester</option>
                          {semesters.map((semester) => (
                            <option key={semester.id} value={semester.id}>
                              {semester.number}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="filter-group">
                        <label className="filter-label required">Subject</label>
                        <select
                          value={markAttendanceSubject}
                          onChange={(e) => setMarkAttendanceSubject(e.target.value)}
                          className="filter-select"
                          style={{ border: markAttendanceSubject ? '2px solid #10b981' : '2px solid #dc2626' }}
                        >
                          <option value="">Select Subject</option>
                          {subjects.map((subject) => (
                            <option key={subject.id} value={subject.id}>
                              {subject.name} ({subject.code})
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {!markAttendanceSubject && (
                      <div className="subject-warning-toast">
                        <span className="warning-icon">⚠️</span>
                        <span>Please select a subject to mark attendance</span>
                      </div>
                    )}

                    {!markAttendanceProgram || !markAttendanceSemester ? (
                      <div className="filter-requirement-message">
                        <p>Please select both <strong>Program</strong> and <strong>Semester</strong> to view students</p>
                      </div>
                    ) : (
                      <>
                        {students.filter(s =>
                          s.program?.id?.toString() === markAttendanceProgram &&
                          s.semester?.id?.toString() === markAttendanceSemester
                        ).length > 0 ? (
                        <div className="table-container">
                          <table className="students-table">
                            <thead>
                              <tr>
                                <th>Name</th>
                                <th>Roll No</th>
                                <th>Program</th>
                                <th>Semester</th>
                                <th>Mark Attendance</th>
                              </tr>
                            </thead>
                            <tbody>
                              {students
                                .filter(s =>
                                  s.program?.id?.toString() === markAttendanceProgram &&
                                  s.semester?.id?.toString() === markAttendanceSemester
                                )
                                .map((student) => (
                                  <tr key={student.id}>
                                    <td>{student.name}</td>
                                    <td>{student.rollNo}</td>
                                    <td>{student.program?.name || 'N/A'}</td>
                                    <td>{student.semester?.number || 'N/A'}</td>
                                    <td>
                                      {isAttendanceAlreadyMarked(student.id, markAttendanceSubject, attendanceDashboardDate) ? (
                                        <div className="attendance-marked-status">
                                          <span className="marked-badge">✓ Already Marked</span>
                                          <p className="edit-instruction">Go to View Attendance to update</p>
                                        </div>
                                      ) : (
                                        <div className="attendance-buttons">
                                          <button
                                            type="button"
                                            onClick={() => markAttendance(student.id, 'present')}
                                            disabled={!markAttendanceSubject || attendanceLoading[student.id]}
                                            className="attendance-btn present-btn"
                                            title={!markAttendanceSubject ? "Please select a subject first" : ""}
                                          >
                                            Present
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => markAttendance(student.id, 'absent')}
                                            disabled={!markAttendanceSubject || attendanceLoading[student.id]}
                                            className="attendance-btn absent-btn"
                                            title={!markAttendanceSubject ? "Please select a subject first" : ""}
                                          >
                                            Absent
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() => markAttendance(student.id, 'leave')}
                                            disabled={!markAttendanceSubject || attendanceLoading[student.id]}
                                            className="attendance-btn leave-btn"
                                            title={!markAttendanceSubject ? "Please select a subject first" : ""}
                                          >
                                            Leave
                                          </button>
                                        </div>
                                      )}
                                    </td>
                                  </tr>
                                ))
                              }
                            </tbody>
                          </table>
                        </div>
                        ) : (
                          <p className="no-attendance">No students found for the selected program and semester</p>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>

              {isAdmin && !isStudent && !isTeacher && (
                <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3>Attendance Records (Admin View)</h3>
                    <button
                      onClick={() => {
                        setIsAddingAttendance(true);
                        fetchStudents();
                        fetchSubjects();
                      }}
                      className="submit-button"
                    >
                      Add Attendance
                    </button>
                  </div>

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
                            <th>Edit</th>
                            <th>Student Name</th>
                            <th>Subject</th>
                            <th>Date</th>
                            <th>Status</th>
                            <th>Action</th>
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
                                <td>
                                  <input
                                    type="checkbox"
                                    checked={editingAttendance[record.id] || false}
                                    onChange={(e) => handleAttendanceCheckbox(record.id, e.target.checked)}
                                    className="edit-checkbox"
                                  />
                                </td>
                                <td>
                                  {editingAttendance[record.id] ? (
                                    <select
                                      value={editAttendanceData[record.id]?.student || ''}
                                      onChange={(e) => handleEditAttendanceChange(record.id, 'student', e.target.value)}
                                      className="edit-select"
                                    >
                                      <option value="">Select Student</option>
                                      {students.map((student) => (
                                        <option key={student.id} value={student.id}>
                                          {student.name} ({student.rollNo})
                                        </option>
                                      ))}
                                    </select>
                                  ) : (
                                    record.student?.name || 'N/A'
                                  )}
                                </td>
                                <td>
                                  {editingAttendance[record.id] ? (
                                    <select
                                      value={editAttendanceData[record.id]?.subject || ''}
                                      onChange={(e) => handleEditAttendanceChange(record.id, 'subject', e.target.value)}
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
                                    record.subject?.name || 'N/A'
                                  )}
                                </td>
                                <td>
                                  {editingAttendance[record.id] ? (
                                    <input
                                      type="date"
                                      value={editAttendanceData[record.id]?.date || ''}
                                      onChange={(e) => handleEditAttendanceChange(record.id, 'date', e.target.value)}
                                      className="edit-input"
                                    />
                                  ) : (
                                    record.date || 'N/A'
                                  )}
                                </td>
                                <td>
                                  {editingAttendance[record.id] ? (
                                    <select
                                      value={editAttendanceData[record.id]?.status || ''}
                                      onChange={(e) => handleEditAttendanceChange(record.id, 'status', e.target.value)}
                                      className="edit-select"
                                    >
                                      <option value="">Select Status</option>
                                      <option value="P">Present</option>
                                      <option value="A">Absent</option>
                                      <option value="L">Leave</option>
                                    </select>
                                  ) : (
                                    <span className={`status-badge ${record.status === 'P' ? 'present' : record.status === 'A' ? 'absent' : 'leave'}`}>
                                      {record.status === 'P' ? 'Present' : record.status === 'A' ? 'Absent' : record.status === 'L' ? 'Leave' : 'N/A'}
                                    </span>
                                  )}
                                </td>
                                <td>
                                  {editingAttendance[record.id] && (
                                    <button
                                      onClick={() => handleUpdateAttendance(record.id)}
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
                    <p className="no-attendance">No attendance records found</p>
                  )}
                </div>
              )}
            </div>
          )}

          {showProgramForm && (
            <div className="program-section">
              {!isAddingProgram ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3>All Programs (Count: {programs.length})</h3>
                    <button
                      onClick={() => setIsAddingProgram(true)}
                      className="submit-button"
                    >
                      Add New Program
                    </button>
                  </div>
                  {success && <div className="success-message">{success}</div>}
                  {programs.length > 0 && (
                    <div className="table-container" style={{ maxWidth: '700px', margin: '0 auto' }}>
                      <table className="students-table">
                        <thead>
                          <tr>
                            <th style={{ width: '10%' }}>Edit</th>
                            <th style={{ width: '15%' }}>ID</th>
                            <th style={{ width: '50%' }}>Name</th>
                            <th style={{ width: '25%' }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {programs.map((program) => (
                            <tr key={program.id}>
                              <td>
                                <input
                                  type="checkbox"
                                  checked={editingPrograms[program.id] || false}
                                  onChange={(e) => handleProgramCheckbox(program.id, e.target.checked)}
                                  className="edit-checkbox"
                                />
                              </td>
                              <td>{program.id}</td>
                              <td>
                                {editingPrograms[program.id] ? (
                                  <input
                                    type="text"
                                    value={editProgramData[program.id]?.name || ''}
                                    onChange={(e) => handleEditProgramChange(program.id, e.target.value)}
                                    className="edit-input"
                                  />
                                ) : (
                                  program.name
                                )}
                              </td>
                              <td>
                                {editingPrograms[program.id] && (
                                  <button
                                    onClick={() => handleUpdateProgram(program.id)}
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
                  )}
                </>
              ) : (
                <div className="form-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3>Add Program Details</h3>
                    <button
                      onClick={() => setIsAddingProgram(false)}
                      className="logout-button"
                      style={{ padding: '5px 10px', fontSize: '12px' }}
                    >
                      Cancel
                    </button>
                  </div>
                  <form onSubmit={handleProgramSubmit} className="program-form" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Program Name"
                        value={programData.name}
                        onChange={(e) => setProgramData({ ...programData, name: e.target.value })}
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
            </div>
          )}

          {showSubjects && (
            <div className="subjects-section">
              {!isAddingSubject ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3>All Subjects (Count: {subjects.length})</h3>
                    <button
                      onClick={() => setIsAddingSubject(true)}
                      className="submit-button"
                    >
                      Add New Subject
                    </button>
                  </div>
                  {success && <div className="success-message">{success}</div>}
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
                </>
              ) : (
                <div className="form-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3>Add Subject Details</h3>
                    <button
                      onClick={() => setIsAddingSubject(false)}
                      className="logout-button"
                      style={{ padding: '5px 10px', fontSize: '12px' }}
                    >
                      Cancel
                    </button>
                  </div>
                  <form onSubmit={handleSubjectSubmit} className="subject-form" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Subject Name"
                        value={subjectData.name}
                        onChange={(e) => setSubjectData({ ...subjectData, name: e.target.value })}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Subject Code"
                        value={subjectData.code}
                        onChange={(e) => setSubjectData({ ...subjectData, code: e.target.value })}
                        className="form-input"
                      />
                    </div>

                    <div className="form-group">
                      <select
                        value={subjectData.program}
                        onChange={(e) => setSubjectData({ ...subjectData, program: e.target.value })}
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
                        onChange={(e) => setSubjectData({ ...subjectData, semester: e.target.value })}
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
                        onChange={(e) => setSubjectData({ ...subjectData, teacher: e.target.value })}
                        className="form-input"
                      >
                        <option value="">Select Teacher</option>
                        {teachers.map((teacher) => (
                          <option key={teacher.id} value={teacher.id}>
                            {teacher.fullName}
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
              )}
            </div>
          )}

          {showCourseAllocation && (
            <div className="allocation-section">
              {!isAddingAllocation ? (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3>Course Allocations (Count: {allocations.length})</h3>
                    <button
                      onClick={() => setIsAddingAllocation(true)}
                      className="submit-button"
                    >
                      Add New Allocation
                    </button>
                  </div>
                  {success && <div className="success-message">{success}</div>}

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
                      <table className="allocations-table" style={{ backgroundColor: 'white' }}>
                        <thead style={{ backgroundColor: '#007bff' }}>
                          <tr>
                            <th style={{ color: 'white' }}>Edit</th>
                            <th style={{ color: 'white' }}>Faculty</th>
                            <th style={{ color: 'white' }}>Subject</th>
                            <th style={{ color: 'white' }}>Semester</th>
                            <th style={{ color: 'white' }}>Teacher</th>
                            <th style={{ color: 'white' }}>Action</th>
                          </tr>
                        </thead>
                        <tbody style={{ backgroundColor: 'white' }}>
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
                </>
              ) : (
                <div className="form-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3>Allocate Course</h3>
                    <button
                      onClick={() => setIsAddingAllocation(false)}
                      className="logout-button"
                      style={{ padding: '5px 10px', fontSize: '12px' }}
                    >
                      Cancel
                    </button>
                  </div>
                  <form onSubmit={handleCourseAllocationSubmit} className="allocation-form" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    <div className="form-group">
                      <select
                        value={allocationData.faculty}
                        onChange={(e) => setAllocationData({ ...allocationData, faculty: e.target.value })}
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
                        onChange={(e) => setAllocationData({ ...allocationData, semester: e.target.value })}
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
                        onChange={(e) => setAllocationData({ ...allocationData, subject: e.target.value })}
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
                        onChange={(e) => setAllocationData({ ...allocationData, teacher: e.target.value })}
                        className="form-input"
                      >
                        <option value="">Select Teacher</option>
                        {teachers.map((teacher) => (
                          <option key={teacher.id} value={teacher.id}>
                            {teacher.fullName}
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
              )}
            </div>
          )}
        </div>
      </div>

      {showReport && (
        <div className="mark-attendance-section" style={{ padding: '2rem' }}>
          <h3 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: '#ffffff' }}>Attendance Report</h3>
          
          {(() => {
            // Calculate summary statistics based on current filters
            let allFilteredAttendance = attendance.filter(record => {
              const matchesProgram = reportProgram ? record.student?.program?.id?.toString() === reportProgram : true;
              const matchesSemester = reportSemester ? record.student?.semester?.id?.toString() === reportSemester : true;
              const matchesSubject = reportSubject ? record.subject?.id?.toString() === reportSubject : true;
              
              return matchesProgram && matchesSemester && matchesSubject;
            });

            const uniqueStudents = new Set(allFilteredAttendance.map(r => r.student?.id));
            const totalStudents = uniqueStudents.size;

            // apply optional date filter for table/charts
            let filteredAttendance = allFilteredAttendance.filter(record => {
              const matchesDate = reportStartDate ? record.date === reportStartDate : true;
              return matchesDate;
            });

            const presentCount = filteredAttendance.filter(r => r.status === 'P').length;
            const absentCount = filteredAttendance.filter(r => r.status === 'A').length;
            const leaveCount = filteredAttendance.filter(r => r.status === 'L').length;

            const presentPct = totalStudents > 0 ? Math.round((presentCount / totalStudents) * 100) : 0;
            const absentPct = totalStudents > 0 ? Math.round((absentCount / totalStudents) * 100) : 0;
            const leavePct = totalStudents > 0 ? Math.round((leaveCount / totalStudents) * 100) : 0;

            return (
              <>
                {/* Summary Cards Above Dropdown */}
                <div style={{
                  display: 'flex',
                  gap: '0.6rem',
                  marginBottom: '1rem',
                  flexWrap: 'wrap'
                }}>
                  <div style={{
                    flex: '1 1 150px',
                    background: 'linear-gradient(90deg, #6366f1, #4f46e5)',
                    padding: '1rem',
                    borderRadius: '10px',
                    textAlign: 'center',
                    color: '#ffffff',
                    boxShadow: '0 6px 18px rgba(0,0,0,0.15)'
                  }}>
                    <div style={{ fontSize: '16px', marginBottom: '0.2rem' }}>👥</div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>{totalStudents}</div>
                    <div style={{ fontSize: '11px', opacity: 0.9 }}>Total</div>
                  </div>

                  <div style={{
                    flex: '1 1 150px',
                    background: 'linear-gradient(90deg, #10b981, #059669)',
                    padding: '1rem',
                    borderRadius: '10px',
                    textAlign: 'center',
                    color: '#ffffff',
                    boxShadow: '0 6px 18px rgba(0,0,0,0.15)'
                  }}>
                    <div style={{ fontSize: '16px', marginBottom: '0.2rem' }}>✅</div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>{presentCount}</div>
                    <div style={{ fontSize: '11px', opacity: 0.9 }}>Present</div>
                  </div>

                  <div style={{
                    flex: '1 1 150px',
                    background: 'linear-gradient(90deg, #dc2626, #b91c1c)',
                    padding: '1rem',
                    borderRadius: '10px',
                    textAlign: 'center',
                    color: '#ffffff',
                    boxShadow: '0 6px 18px rgba(0,0,0,0.15)'
                  }}>
                    <div style={{ fontSize: '16px', marginBottom: '0.2rem' }}>❌</div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>{absentCount}</div>
                    <div style={{ fontSize: '11px', opacity: 0.9 }}>Absent</div>
                  </div>

                  <div style={{
                    flex: '1 1 150px',
                    background: 'linear-gradient(90deg, #f59e0b, #d97706)',
                    padding: '1rem',
                    borderRadius: '10px',
                    textAlign: 'center',
                    color: '#ffffff',
                    boxShadow: '0 6px 18px rgba(0,0,0,0.15)'
                  }}>
                    <div style={{ fontSize: '16px', marginBottom: '0.2rem' }}>🏥</div>
                    <div style={{ fontSize: '20px', fontWeight: '700' }}>{leaveCount}</div>
                    <div style={{ fontSize: '11px', opacity: 0.9 }}>Leave</div>
                  </div>
                </div>

                {/* Charts above filters, then table (resizable) left and pie chart/right column */}
                <div style={{ marginBottom: '1rem' }}>
                  {/* Charts row: pie (left), filters (middle, small/resizable), bar (right) */}
                  <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                    <div style={{ flex: '1 1 0', minWidth: '240px', background: 'rgba(255,255,255,0.04)', padding: '1rem', borderRadius: '10px' }}>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#ffffff' }}>Attendance Distribution</h4>
                      {totalStudents > 0 ? (
                        <svg viewBox="0 0 200 200" style={{ width: '160px', height: '160px' }}>
                          <circle cx="100" cy="100" r="70" fill="none" stroke="#10b981" strokeWidth="14" strokeDasharray={`${(presentPct/100)*439.8} 439.8`} transform="rotate(-90 100 100)" />
                          <circle cx="100" cy="100" r="70" fill="none" stroke="#dc2626" strokeWidth="14" strokeDasharray={`${(absentPct/100)*439.8} 439.8`} strokeDashoffset={`${-((presentPct/100)*439.8)}`} transform="rotate(-90 100 100)" />
                          <circle cx="100" cy="100" r="70" fill="none" stroke="#f59e0b" strokeWidth="14" strokeDasharray={`${(leavePct/100)*439.8} 439.8`} strokeDashoffset={`${-(((presentPct+absentPct)/100)*439.8)}`} transform="rotate(-90 100 100)" />
                          <circle cx="100" cy="100" r="44" fill="rgba(255,255,255,0.04)" />
                        </svg>
                      ) : (
                        <div style={{ color: '#cbd5e1' }}>No data</div>
                      )}
                    </div>

                    <div style={{ flex: '0 0 220px', minWidth: '160px', maxWidth: '300px', resize: 'horizontal', overflow: 'auto', background: 'rgba(255,255,255,0.03)', padding: '0.6rem', borderRadius: '8px' }}>
                      <h5 style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#ffffff' }}>Filters</h5>
                      <div className="filter-container" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.6rem', alignItems: 'end' }}>
                        <div className="filter-group">
                          <label className="filter-label">Program</label>
                          <select value={reportProgram} onChange={(e) => setReportProgram(e.target.value)} className="filter-select" style={{ padding: '6px' }}>
                            <option value="">Select Program</option>
                            {programs.map((program) => (<option key={program.id} value={program.id}>{program.name}</option>))}
                          </select>
                        </div>
                        <div className="filter-group">
                          <label className="filter-label">Semester</label>
                          <select value={reportSemester} onChange={(e) => setReportSemester(e.target.value)} className="filter-select" style={{ padding: '6px' }}>
                            <option value="">Select Semester</option>
                            {semesters.map((semester) => (<option key={semester.id} value={semester.id}>{semester.number}</option>))}
                          </select>
                        </div>
                        <div className="filter-group">
                          <label className="filter-label">Subject</label>
                          <select value={reportSubject} onChange={(e) => setReportSubject(e.target.value)} className="filter-select" style={{ padding: '6px' }}>
                            <option value="">Select Subject</option>
                            {subjects.map((subject) => (<option key={subject.id} value={subject.id}>{subject.name} ({subject.code})</option>))}
                          </select>
                        </div>
                        <div className="filter-group">
                          <label className="filter-label">📅 Date</label>
                          <input type="date" value={reportStartDate} onChange={(e) => setReportStartDate(e.target.value)} className="filter-select" style={{ padding: '6px' }} />
                        </div>
                      </div>
                    </div>

                    <div style={{ flex: '1 1 0', minWidth: '240px', background: 'rgba(255,255,255,0.04)', padding: '1rem', borderRadius: '10px' }}>
                      <h4 style={{ margin: '0 0 6px 0', fontSize: '13px', color: '#ffffff' }}>Attendance Bar Graph</h4>
                      {totalStudents > 0 ? (
                        <svg viewBox="0 0 260 160" style={{ width: '100%', height: '140px' }}>
                          <g fill="#374151" opacity="0.06">
                            <rect x="0" y="0" width="260" height="160" />
                          </g>
                          {(() => {
                            const maxCount = Math.max(presentCount, absentCount, leaveCount, 1);
                            const maxH = 100;
                            const pH = (presentCount / maxCount) * maxH;
                            const aH = (absentCount / maxCount) * maxH;
                            const lH = (leaveCount / maxCount) * maxH;
                            return (
                              <g>
                                <rect x="40" y={120 - pH} width="40" height={pH} rx="4" fill="#10b981" />
                                <rect x="110" y={120 - aH} width="40" height={aH} rx="4" fill="#dc2626" />
                                <rect x="180" y={120 - lH} width="40" height={lH} rx="4" fill="#f59e0b" />
                                <text x="60" y="138" fontSize="11" fill="#cbd5e1" textAnchor="middle">{presentCount}</text>
                                <text x="130" y="138" fontSize="11" fill="#cbd5e1" textAnchor="middle">{absentCount}</text>
                                <text x="200" y="138" fontSize="11" fill="#cbd5e1" textAnchor="middle">{leaveCount}</text>
                                <text x="60" y="152" fontSize="11" fill="#cbd5e1" textAnchor="middle">Present</text>
                                <text x="130" y="152" fontSize="11" fill="#cbd5e1" textAnchor="middle">Absent</text>
                                <text x="200" y="152" fontSize="11" fill="#cbd5e1" textAnchor="middle">Leave</text>
                              </g>
                            );
                          })()}
                        </svg>
                      ) : (
                        <div style={{ color: '#cbd5e1' }}>No data</div>
                      )}
                    </div>
                  </div>
*** End Replace */}                    <div className="filter-group">
                      <label className="filter-label">Program</label>
                      <select value={reportProgram} onChange={(e) => setReportProgram(e.target.value)} className="filter-select" style={{ padding: '8px' }}>
                        <option value="">Select Program</option>
                        {programs.map((program) => (<option key={program.id} value={program.id}>{program.name}</option>))}
                      </select>
                    </div>
                    <div className="filter-group">
                      <label className="filter-label">Semester</label>
                      <select value={reportSemester} onChange={(e) => setReportSemester(e.target.value)} className="filter-select" style={{ padding: '8px' }}>
                        <option value="">Select Semester</option>
                        {semesters.map((semester) => (<option key={semester.id} value={semester.id}>{semester.number}</option>))}
                      </select>
                    </div>
                    <div className="filter-group">
                      <label className="filter-label">Subject</label>
                      <select value={reportSubject} onChange={(e) => setReportSubject(e.target.value)} className="filter-select" style={{ padding: '8px' }}>
                        <option value="">Select Subject</option>
                        {subjects.map((subject) => (<option key={subject.id} value={subject.id}>{subject.name} ({subject.code})</option>))}
                      </select>
                    </div>
                    <div className="filter-group">
                      <label className="filter-label">📅 Date</label>
                      <input type="date" value={reportStartDate} onChange={(e) => setReportStartDate(e.target.value)} className="filter-select" style={{ padding: '8px' }} />
                    </div>
                  </div>

                  {/* Filter Container with Pie Chart */}
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <div className="filter-container" style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                        <div className="filter-group" style={{ flex: '1 1 200px', minWidth: '200px' }}>
                          <label className="filter-label">Program</label>
                          <select
                            value={reportProgram}
                            onChange={(e) => setReportProgram(e.target.value)}
                            className="filter-select"
                            style={{ width: '100%' }}
                          >
                            <option value="">Select Program</option>
                            {programs.map((program) => (
                              <option key={program.id} value={program.id}>
                                {program.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="filter-group" style={{ flex: '1 1 150px', minWidth: '150px' }}>
                          <label className="filter-label">Semester</label>
                          <select
                            value={reportSemester}
                            onChange={(e) => setReportSemester(e.target.value)}
                            className="filter-select"
                            style={{ width: '100%' }}
                          >
                            <option value="">Select Semester</option>
                            {semesters.map((semester) => (
                              <option key={semester.id} value={semester.id}>
                                {semester.number}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="filter-group" style={{ flex: '1 1 200px', minWidth: '200px' }}>
                          <label className="filter-label">Subject</label>
                          <select
                            value={reportSubject}
                            onChange={(e) => setReportSubject(e.target.value)}
                            className="filter-select"
                            style={{ width: '100%' }}
                          >
                            <option value="">Select Subject</option>
                            {subjects.map((subject) => (
                              <option key={subject.id} value={subject.id}>
                                {subject.name} ({subject.code})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="filter-group" style={{ flex: '0 0 auto' }}>
                          <label className="filter-label">📅 Date</label>
                          <input
                            type="date"
                            value={reportStartDate}
                            onChange={(e) => setReportStartDate(e.target.value)}
                            className="filter-select"
                            style={{
                              padding: '10px 12px',
                              fontSize: '14px',
                              background: 'rgba(255, 255, 255, 0.1)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              borderRadius: '8px',
                              color: '#ffffff',
                              boxSizing: 'border-box',
                              cursor: 'pointer',
                              minWidth: '160px'
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Pie Chart Above Calendar */}
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      minWidth: '280px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center'
                    }}>
                      <h4 style={{ margin: '0 0 1rem 0', color: '#ffffff', fontSize: '14px' }}>Attendance Distribution</h4>
                      
                      {/* Simple Pie Chart using SVG */}
                      {totalStudents > 0 ? (
                        <svg viewBox="0 0 200 200" style={{ width: '180px', height: '180px', marginBottom: '1rem' }}>
                          {/* Present Segment */}
                          <circle
                            cx="100" cy="100" r="80"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="20"
                            strokeDasharray={`${(presentPct / 100) * 502.654} 502.654`}
                            transform="rotate(-90 100 100)"
                          />
                          {/* Absent Segment */}
                          <circle
                            cx="100" cy="100" r="80"
                            fill="none"
                            stroke="#dc2626"
                            strokeWidth="20"
                            strokeDasharray={`${(absentPct / 100) * 502.654} 502.654`}
                            strokeDashoffset={`${-((presentPct / 100) * 502.654)}`}
                            transform="rotate(-90 100 100)"
                          />
                          {/* Leave Segment */}
                          <circle
                            cx="100" cy="100" r="80"
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="20"
                            strokeDasharray={`${(leavePct / 100) * 502.654} 502.654`}
                            strokeDashoffset={`${-(((presentPct + absentPct) / 100) * 502.654)}`}
                            transform="rotate(-90 100 100)"
                          />
                          <circle cx="100" cy="100" r="50" fill="rgba(255, 255, 255, 0.05)" />
                        </svg>
                      ) : (
                        <div style={{ fontSize: '14px', color: '#cbd5e1', textAlign: 'center' }}>No data available</div>
                      )}

                      {/* Legend */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%', fontSize: '12px', color: '#cbd5e1' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#10b981' }}></div>
                          <span>Present: {presentPct}%</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#dc2626' }}></div>
                          <span>Absent: {absentPct}%</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#f59e0b' }}></div>
                          <span>Leave: {leavePct}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {!reportProgram || !reportSemester || !reportSubject ? (
                    <div className="filter-requirement-message">
                      <p>Please select <strong>Program</strong>, <strong>Semester</strong>, and <strong>Subject</strong> to generate report</p>
                    </div>
                  ) : (
                    <>
                      {(() => {
                        let filteredAttendance = attendance.filter(record => {
                          const matchesProgram = record.student?.program?.id?.toString() === reportProgram;
                          const matchesSemester = record.student?.semester?.id?.toString() === reportSemester;
                          const matchesSubject = record.subject?.id?.toString() === reportSubject;
                          const matchesDate = reportStartDate ? record.date === reportStartDate : true;
                          return matchesProgram && matchesSemester && matchesSubject && matchesDate;
                        });

                        return (
                          <div style={{ marginTop: '2rem' }}>
                            <h4 style={{ color: '#ffffff', marginBottom: '1rem' }}>Attendance Records ({filteredAttendance.length})</h4>
                            {filteredAttendance.length > 0 ? (
                              <div className="table-container">
                                <table className="students-table">
                                  <thead>
                                    <tr>
                                      <th>Student Name</th>
                                      <th>Roll No</th>
                                      <th>Program</th>
                                      <th>Semester</th>
                                      <th>Subject</th>
                                      <th>Date</th>
                                      <th>Status</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {filteredAttendance.map((record) => (
                                      <tr key={record.id}>
                                        <td>{record.student?.name || 'N/A'}</td>
                                        <td>{record.student?.rollNo || 'N/A'}</td>
                                        <td>{record.student?.program?.name || 'N/A'}</td>
                                        <td>{record.student?.semester?.number || 'N/A'}</td>
                                        <td>{record.subject?.name || 'N/A'}</td>
                                        <td>{record.date || 'N/A'}</td>
                                        <td>
                                          <span className={`status-badge ${record.status === 'P' ? 'present' : record.status === 'A' ? 'absent' : 'leave'}`}>
                                            {record.status === 'P' ? 'Present' : record.status === 'A' ? 'Absent' : record.status === 'L' ? 'Leave' : 'N/A'}
                                          </span>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            ) : (
                              <p className="no-attendance" style={{ color: '#cbd5e1', textAlign: 'center', padding: '2rem' }}>No attendance records found for selected filters</p>
                            )}
                          </div>
                        );
                      })()}
                    </>
                  )}

                {(!reportProgram || !reportSemester || !reportSubject) && (
                  <div className="filter-requirement-message">
                    <p>Please select <strong>Program</strong>, <strong>Semester</strong>, and <strong>Subject</strong> to generate report</p>
                  </div>
                )}
              </>
            );
          }()}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
