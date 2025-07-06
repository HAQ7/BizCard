import { NavLink, useSearchParams, useNavigate } from "react-router";
import logo from "../../assets/logo.svg";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LoaderCircleIcon } from "lucide-react";

function AuthPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const authTypeParam = searchParams.get("type");
    const [authType, setAuthType] = useState(
        authTypeParam === "signup" ? "signup" : "login"
    );
    const [formData, setFormData] = useState({
        fullName: "",
        roleName: "",
        phoneNumber: "",
        username: "",
        email: "",
        password: "",
        confirmpassword: "",
    });
    const [focusedField, setFocusedField] = useState("");
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
    const [requestError, setRequestError] = useState("");
    const [loading, setLoading] = useState(false);

    // Check for existing token on component mount
    useEffect(() => {
        const existingToken = localStorage.getItem("authToken");
        if (existingToken) {
            // Token exists, redirect to my-cards
            navigate("/my-cards");
        }
    }, [navigate]);

    const validateField = (name: string, value: string) => {
        let error = "";

        switch (name) {
            case "fullName":
                if (!value.trim()) {
                    error = "Full name is required";
                } else if (value.trim().length < 3) {
                    error = "Full name must be at least 3 characters";
                } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                    error = "Full name can only contain letters and spaces";
                }
                break;

            case "roleName":
                if (!value.trim()) {
                    error = "Role name is required";
                } else if (value.trim().length < 3) {
                    error = "Role name must be at least 3 characters";
                }
                break;

            case "phoneNumber":
                if (!value.trim()) {
                    error = "Phone number is required";
                } else if (
                    !/^\+?[\d\s\-\(\)]{10,}$/.test(value.replace(/\s/g, ""))
                ) {
                    error = "Please enter a valid phone number";
                }
                break;

            case "username":
                if (!value.trim()) {
                    error = "Username is required";
                } else if (value.length < 3) {
                    error = "Username must be at least 3 characters";
                } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
                    error =
                        "Username can only contain letters, numbers, and underscores";
                }
                break;

            case "email":
                if (!value.trim()) {
                    error = "Email is required";
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    error = "Please enter a valid email address";
                }
                break;

            case "password":
                if (!value) {
                    error = "Password is required";
                } else if (value.length < 8) {
                    error = "Password must be at least 8 characters";
                } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
                    error =
                        "Password must contain at least one uppercase letter, one lowercase letter, and one number";
                }
                break;

            case "confirmpassword":
                if (!value) {
                    error = "Please confirm your password";
                } else if (value !== formData.password) {
                    error = "Passwords do not match";
                }
                break;
        }

        return error;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Validate on change if field was previously touched
        if (touched[name]) {
            const error = validateField(name, value);
            setErrors({ ...errors, [name]: error });
        }
    };

    const handleFocus = (fieldName: string) => {
        setFocusedField(fieldName);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        const fieldName = e.target.name;
        setFocusedField("");
        setTouched({ ...touched, [fieldName]: true });

        // Validate on blur
        const error = validateField(
            fieldName,
            formData[fieldName as keyof typeof formData]
        );
        setErrors({ ...errors, [fieldName]: error });
    };

    const isFieldActive = (fieldName: keyof typeof formData) => {
        return focusedField === fieldName || formData[fieldName] !== "";
    };

    const hasError = (fieldName: string) => {
        return touched[fieldName] && errors[fieldName];
    };

    const validateAllFields = () => {
        const newErrors: { [key: string]: string } = {};
        const newTouched: { [key: string]: boolean } = {};

        // Get required fields based on auth type
        const requiredFields =
            authType === "login"
                ? ["username", "password"]
                : [
                      "fullName",
                      "roleName",
                      "phoneNumber",
                      "username",
                      "email",
                      "password",
                      "confirmpassword",
                  ];

        // Validate all required fields
        requiredFields.forEach(field => {
            const error = validateField(
                field,
                formData[field as keyof typeof formData]
            );
            newErrors[field] = error;
            newTouched[field] = true;
        });

        setErrors(newErrors);
        setTouched(newTouched);

        // Check if there are any errors
        return !requiredFields.some(field => newErrors[field]);
    };

    const isFormValid = () => {
        const requiredFields =
            authType === "login"
                ? ["username", "password"]
                : [
                      "fullName",
                      "roleName",
                      "phoneNumber",
                      "username",
                      "email",
                      "password",
                      "confirmpassword",
                  ];

        // Check if all required fields have values and no errors
        return requiredFields.every(field => {
            const value = formData[field as keyof typeof formData];
            const error = validateField(field, value);
            return value.trim() !== "" && !error;
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        if (validateAllFields()) {
            try {
                const endpoint =
                    authType === "login"
                        ? "http://localhost:5280/api/user/login"
                        : "http://localhost:5280/api/user/signup";

                // Prepare the form data
                const formDataToSend = new FormData();

                if (authType === "login") {
                    formDataToSend.append("username", formData.username);
                    formDataToSend.append("password", formData.password);
                } else {
                    formDataToSend.append("fullName", formData.fullName);
                    formDataToSend.append("roleName", formData.roleName);
                    formDataToSend.append("phoneNumber", formData.phoneNumber);
                    formDataToSend.append("username", formData.username);
                    formDataToSend.append("email", formData.email);
                    formDataToSend.append("password", formData.password);
                    formDataToSend.append(
                        "confirmpassword",
                        formData.confirmpassword
                    );
                }

                const response = await fetch(endpoint, {
                    method: "POST",
                    body: formDataToSend,
                });

                // Check if response is JSON
                const contentType = response.headers.get("content-type");
                let data;

                if (contentType && contentType.includes("application/json")) {
                    data = await response.json();
                } else {
                    // Handle non-JSON responses (like plain text error messages)
                    const textData = await response.text();
                    data = textData;
                }

                if (response.ok) {
                    // Success - store the token
                    const token = data;

                    // You can store the token in localStorage or context
                    localStorage.setItem("authToken", token);

                    console.log("Authentication successful, token:", token);

                    // Redirect to my-cards
                    navigate("/my-cards");
                } else {
                    // Error response
                    console.log("Authentication failed:", data);
                    setRequestError(`${data}`);
                }
            } catch (error) {
                console.log("Network error:", error);
                setRequestError(`${error}`);
            }
        } else {
            // Form has errors, scroll to first error
            console.log("Form has validation errors");
        }
        setLoading(false);
    };

    return (
        <>
            <header className="flex justify-between items-center m-2 mx-4">
                <NavLink
                    to={"/"}
                    className="text-[#3E3E3E] hover:text-[hsl(0,0%,19%)] transition-colors"
                >
                    <img className="w-20" src={logo} />
                </NavLink>
            </header>
            <main className="grid place-items-center">
                <div className="mt-10 max-w-[500px] w-full">
                    <div className="flex justify-around w-full">
                        <div>
                            <button
                                className={`text-2xl font-semibold cursor-pointer ${
                                    authType === "login"
                                        ? "text-black"
                                        : "text-[#A0A0A0]"
                                }`}
                                onClick={() => {
                                    setRequestError("");
                                    setAuthType("login");
                                }}
                            >
                                Login
                            </button>
                            {authType == "login" && (
                                <motion.div
                                    layoutId="authtype"
                                    className="w-full h-1 mt-1 bg-[#0051FF] rounded-full "
                                />
                            )}
                        </div>
                        <div>
                            <button
                                className={`text-2xl font-semibold cursor-pointer ${
                                    authType === "signup"
                                        ? "text-black"
                                        : "text-[#A0A0A0]"
                                }`}
                                onClick={() => {
                                    setRequestError("");
                                    setAuthType("signup");
                                }}
                            >
                                Sign Up
                            </button>
                            {authType == "signup" && (
                                <motion.div
                                    layoutId="authtype"
                                    className="w-full h-1 mt-1 bg-[#0051FF] rounded-full "
                                />
                            )}
                        </div>
                    </div>
                    <form
                        className="bg-white shadow p-5 mt-3 rounded-xl"
                        onSubmit={handleSubmit}
                    >
                        <div className="flex flex-col gap-4 mt-4">
                            {authType === "login" ? (
                                <>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            onFocus={() =>
                                                handleFocus("username")
                                            }
                                            onBlur={handleBlur}
                                            className={`w-full border p-2 pt-6 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent peer ${
                                                hasError("username")
                                                    ? "border-red-500 focus:ring-red-500"
                                                    : "border-gray-300 focus:ring-[#0051FF]"
                                            }`}
                                        />
                                        <label
                                            className={`absolute left-2 transition-all duration-200 pointer-events-none ${
                                                isFieldActive("username")
                                                    ? `top-1 text-xs ${
                                                          hasError("username")
                                                              ? "text-red-500"
                                                              : "text-[#0051FF]"
                                                      }`
                                                    : "top-2 text-base text-gray-500"
                                            }`}
                                        >
                                            Username
                                        </label>
                                        {hasError("username") && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.username}
                                            </p>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            onFocus={() =>
                                                handleFocus("password")
                                            }
                                            onBlur={handleBlur}
                                            className={`w-full border p-2 pt-6 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent peer ${
                                                hasError("password")
                                                    ? "border-red-500 focus:ring-red-500"
                                                    : "border-gray-300 focus:ring-[#0051FF]"
                                            }`}
                                        />
                                        <label
                                            className={`absolute left-2 transition-all duration-200 pointer-events-none ${
                                                isFieldActive("password")
                                                    ? `top-1 text-xs ${
                                                          hasError("password")
                                                              ? "text-red-500"
                                                              : "text-[#0051FF]"
                                                      }`
                                                    : "top-2 text-base text-gray-500"
                                            }`}
                                        >
                                            Password
                                        </label>
                                        {hasError("password") && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>
                                    {requestError && (
                                        <div className="border-red-500 border bg-red-100 text-red-400 p-5 rounded-lg">
                                            {requestError}
                                        </div>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={!isFormValid()}
                                        className={`px-4 py-2 rounded-lg transition-colors cursor-pointer grid place-items-center ${
                                            isFormValid()
                                                ? "bg-[#0051FF] text-white hover:bg-[hsl(221,100%,45%)]"
                                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        }`}
                                    >
                                        {!loading ? (
                                            "Login"
                                        ) : (
                                            <LoaderCircleIcon className=" animate-spin" />
                                        )}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="grid sm:grid-cols-2 gap-4">
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                onChange={handleInputChange}
                                                onFocus={() =>
                                                    handleFocus("fullName")
                                                }
                                                onBlur={handleBlur}
                                                className={`w-full border p-2 pt-6 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                                                    hasError("fullName")
                                                        ? "border-red-500 focus:ring-red-500"
                                                        : "border-gray-300 focus:ring-[#0051FF]"
                                                }`}
                                            />
                                            <label
                                                className={`absolute left-2 transition-all duration-200 pointer-events-none ${
                                                    isFieldActive("fullName")
                                                        ? `top-1 text-xs ${
                                                              hasError(
                                                                  "fullName"
                                                              )
                                                                  ? "text-red-500"
                                                                  : "text-[#0051FF]"
                                                          }`
                                                        : "top-2 text-base text-gray-500"
                                                }`}
                                            >
                                                Full name
                                            </label>
                                            {hasError("fullName") && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors.fullName}
                                                </p>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                name="roleName"
                                                value={formData.roleName}
                                                onChange={handleInputChange}
                                                onFocus={() =>
                                                    handleFocus("roleName")
                                                }
                                                onBlur={handleBlur}
                                                className={`w-full border p-2 pt-6 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                                                    hasError("roleName")
                                                        ? "border-red-500 focus:ring-red-500"
                                                        : "border-gray-300 focus:ring-[#0051FF]"
                                                }`}
                                            />
                                            <label
                                                className={`absolute left-2 transition-all duration-200 pointer-events-none ${
                                                    isFieldActive("roleName")
                                                        ? `top-1 text-xs ${
                                                              hasError(
                                                                  "roleName"
                                                              )
                                                                  ? "text-red-500"
                                                                  : "text-[#0051FF]"
                                                          }`
                                                        : "top-2 text-base text-gray-500"
                                                }`}
                                            >
                                                Role name
                                            </label>
                                            {hasError("roleName") && (
                                                <p className="text-red-500 text-xs mt-1">
                                                    {errors.roleName}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleInputChange}
                                            onFocus={() =>
                                                handleFocus("phoneNumber")
                                            }
                                            onBlur={handleBlur}
                                            className={`w-full border p-2 pt-6 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                                                hasError("phoneNumber")
                                                    ? "border-red-500 focus:ring-red-500"
                                                    : "border-gray-300 focus:ring-[#0051FF]"
                                            }`}
                                        />
                                        <label
                                            className={`absolute left-2 transition-all duration-200 pointer-events-none ${
                                                isFieldActive("phoneNumber")
                                                    ? `top-1 text-xs ${
                                                          hasError(
                                                              "phoneNumber"
                                                          )
                                                              ? "text-red-500"
                                                              : "text-[#0051FF]"
                                                      }`
                                                    : "top-2 text-base text-gray-500"
                                            }`}
                                        >
                                            Phone number
                                        </label>
                                        {hasError("phoneNumber") && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.phoneNumber}
                                            </p>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            onFocus={() =>
                                                handleFocus("username")
                                            }
                                            onBlur={handleBlur}
                                            className={`w-full border p-2 pt-6 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                                                hasError("username")
                                                    ? "border-red-500 focus:ring-red-500"
                                                    : "border-gray-300 focus:ring-[#0051FF]"
                                            }`}
                                        />
                                        <label
                                            className={`absolute left-2 transition-all duration-200 pointer-events-none ${
                                                isFieldActive("username")
                                                    ? `top-1 text-xs ${
                                                          hasError("username")
                                                              ? "text-red-500"
                                                              : "text-[#0051FF]"
                                                      }`
                                                    : "top-2 text-base text-gray-500"
                                            }`}
                                        >
                                            Username
                                        </label>
                                        {hasError("username") && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.username}
                                            </p>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            onFocus={() => handleFocus("email")}
                                            onBlur={handleBlur}
                                            className={`w-full border p-2 pt-6 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                                                hasError("email")
                                                    ? "border-red-500 focus:ring-red-500"
                                                    : "border-gray-300 focus:ring-[#0051FF]"
                                            }`}
                                        />
                                        <label
                                            className={`absolute left-2 transition-all duration-200 pointer-events-none ${
                                                isFieldActive("email")
                                                    ? `top-1 text-xs ${
                                                          hasError("email")
                                                              ? "text-red-500"
                                                              : "text-[#0051FF]"
                                                      }`
                                                    : "top-2 text-base text-gray-500"
                                            }`}
                                        >
                                            Email
                                        </label>
                                        {hasError("email") && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            onFocus={() =>
                                                handleFocus("password")
                                            }
                                            onBlur={handleBlur}
                                            className={`w-full border p-2 pt-6 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                                                hasError("password")
                                                    ? "border-red-500 focus:ring-red-500"
                                                    : "border-gray-300 focus:ring-[#0051FF]"
                                            }`}
                                        />
                                        <label
                                            className={`absolute left-2 transition-all duration-200 pointer-events-none ${
                                                isFieldActive("password")
                                                    ? `top-1 text-xs ${
                                                          hasError("password")
                                                              ? "text-red-500"
                                                              : "text-[#0051FF]"
                                                      }`
                                                    : "top-2 text-base text-gray-500"
                                            }`}
                                        >
                                            Password
                                        </label>
                                        {hasError("password") && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.password}
                                            </p>
                                        )}
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            name="confirmpassword"
                                            value={formData.confirmpassword}
                                            onChange={handleInputChange}
                                            onFocus={() =>
                                                handleFocus("confirmpassword")
                                            }
                                            onBlur={handleBlur}
                                            className={`w-full border p-2 pt-6 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                                                hasError("confirmpassword")
                                                    ? "border-red-500 focus:ring-red-500"
                                                    : "border-gray-300 focus:ring-[#0051FF]"
                                            }`}
                                        />
                                        <label
                                            className={`absolute left-2 transition-all duration-200 pointer-events-none ${
                                                isFieldActive("confirmpassword")
                                                    ? `top-1 text-xs ${
                                                          hasError(
                                                              "confirmpassword"
                                                          )
                                                              ? "text-red-500"
                                                              : "text-[#0051FF]"
                                                      }`
                                                    : "top-2 text-base text-gray-500"
                                            }`}
                                        >
                                            Confirm Password
                                        </label>
                                        {hasError("confirmpassword") && (
                                            <p className="text-red-500 text-xs mt-1">
                                                {errors.confirmpassword}
                                            </p>
                                        )}
                                    </div>
                                    {requestError && (
                                        <div className="border-red-500 border bg-red-100 text-red-400 p-5 rounded-lg">
                                            {requestError}
                                        </div>
                                    )}
                                    <button
                                        type="submit"
                                        disabled={!isFormValid()}
                                        className={`px-4 py-2 rounded-lg transition-colors grid place-items-center ${
                                            isFormValid()
                                                ? "bg-[#0051FF] text-white hover:bg-[hsl(221,100%,45%)] cursor-pointer"
                                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        }`}
                                    >
                                        {!loading ? (
                                            "Sign Up"
                                        ) : (
                                            <LoaderCircleIcon className="animate-spin" />
                                        )}
                                    </button>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </main>
        </>
    );
}

export default AuthPage;
