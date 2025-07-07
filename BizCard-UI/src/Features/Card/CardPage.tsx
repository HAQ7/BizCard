import { useEffect, useState } from "react";
import CardComponent from "../../components/Card";
import { useUser } from "../../context/UserContext";
import { NavLink, useParams } from "react-router";
import {
  ArrowLeftIcon,
  CopyIcon,
  FrownIcon,
  LoaderCircleIcon,
  SaveIcon,
} from "lucide-react";
import type { Card } from "../../types/Card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function CardPage() {
  const { user: loggedInUser } = useUser();
  const [fetchedCard, setFetchedCard] = useState<Card>(null as any);
  const [originalCard, setOriginalCard] = useState<Card>(null as any);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const params = useParams();
  const isOwner = fetchedCard?.owner?.id === loggedInUser?.id;

  // Form state
  const [formData, setFormData] = useState({
    displayName: "",
    roleName: "",
    bgColor: "#ffffff",
    textColor: "#000000",
    email: "",
    phoneNumber: "",
    linkedIn: "",
    x: "",
    customURL: "",
    customURLName: "",
    isMain: false,
  });

  const [focusedField, setFocusedField] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchMainCard = async () => {
      try {
        let response;
        if (params.username) {
          response = await fetch(
            `http://localhost:5280/api/card/main/${params.username}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        } else {
          response = await fetch(
            `http://localhost:5280/api/card/${params.cardId}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        }

        if (!response.ok) {
          const errorData = await response.text();
          setError(errorData);
          return;
        }

        const data = await response.json();
        setFetchedCard(data);
        setOriginalCard(data);

        console.log("Fetched main card:", data);

        // Populate form with fetched data
        setFormData({
          displayName: data.displayName || "",
          roleName: data.roleName || "",
          bgColor: data.bgColor || "#ffffff",
          textColor: data.textColor || "#000000",
          email: data.email || "",
          phoneNumber: data.phoneNumber || "",
          linkedIn: data.linkedIn || "",
          x: data.x || "",
          customURL: data.customURL || "",
          customURLName: data.customURLName || "",
          isMain: data.isMain || false,
        });
      } catch (error) {
        console.error("Error fetching card:", error);
        setError("Failed to load card");
      } finally {
        setLoading(false);
      }
    };

    fetchMainCard();
  }, [params.username]);

  const validateField = (name: string, value: string | boolean) => {
    let error = "";

    // Skip validation for boolean fields
    if (name === "isMain" || typeof value === "boolean") {
      return error;
    }

    const stringValue = value as string;

    switch (name) {
      case "displayName":
        if (!stringValue.trim()) {
          error = "Display name is required";
        } else if (stringValue.trim().length < 3) {
          error = "Display name must be at least 3 characters";
        } else if (stringValue.trim().length > 100) {
          error = "Display name must be less than 100 characters";
        }
        break;

      case "roleName":
        if (!stringValue.trim()) {
          error = "Role name is required";
        } else if (stringValue.trim().length < 3) {
          error = "Role name must be at least 3 characters";
        } else if (stringValue.trim().length > 100) {
          error = "Role name must be less than 100 characters";
        }
        break;

      case "bgColor":
        if (!stringValue.trim()) {
          error = "Background color is required";
        } else if (!/^#[0-9A-F]{6}$/i.test(stringValue)) {
          error = "Please enter a valid hex color (e.g., #FF0000)";
        }
        break;

      case "textColor":
        if (!stringValue.trim()) {
          error = "Text color is required";
        } else if (!/^#[0-9A-F]{6}$/i.test(stringValue)) {
          error = "Please enter a valid hex color (e.g., #000000)";
        }
        break;

      case "email":
        if (stringValue.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(stringValue)) {
          error = "Please enter a valid email address";
        }
        break;

      case "phoneNumber":
        if (
          stringValue.trim() &&
          !/^\+?[\d\s\-\(\)]{10,}$/.test(stringValue.replace(/\s/g, ""))
        ) {
          error = "Please enter a valid phone number";
        }
        break;

      case "linkedIn":
        if (stringValue.trim() && !stringValue.includes("linkedin.com")) {
          error = "Please enter a valid LinkedIn URL";
        }
        break;

      case "x":
        if (
          stringValue.trim() &&
          !stringValue.includes("x.com") &&
          !stringValue.includes("twitter.com")
        ) {
          error = "Please enter a valid X/Twitter URL";
        }
        break;

      case "customURL":
        if (stringValue.trim() && !/^https?:\/\/.+/.test(stringValue)) {
          error =
            "Please enter a valid URL (starting with http:// or https://)";
        }
        break;

      case "customURLName":
        if (stringValue.trim() && stringValue.trim().length > 50) {
          error = "Custom URL name must be less than 50 characters";
        }
        break;
    }

    return error;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === "checkbox" ? checked : value;
    const updatedFormData = { ...formData, [name]: inputValue };
    setFormData(updatedFormData);

    // Update card preview in real-time
    const previewCard = {
      ...fetchedCard,
      displayName: updatedFormData.displayName,
      roleName: updatedFormData.roleName,
      bgColor: updatedFormData.bgColor,
      textColor: updatedFormData.textColor,
      email: updatedFormData.email,
      phoneNumber: updatedFormData.phoneNumber,
      linkedIn: updatedFormData.linkedIn,
      x: updatedFormData.x,
      customURL: updatedFormData.customURL,
      customURLName: updatedFormData.customURLName,
      isMain: updatedFormData.isMain,
    };
    setFetchedCard(previewCard);

    // Clear save success when user starts editing
    setSaveSuccess(false);

    // Validate on change if field was previously touched
    if (touched[name]) {
      const error = validateField(name, inputValue);
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

    // Validate all fields
    Object.keys(formData).forEach((field) => {
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
    return !Object.values(newErrors).some((error) => error !== "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isOwner) {
      return;
    }

    if (!validateAllFields()) {
      return;
    }

    setSaving(true);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setError("Authentication required");
        return;
      }

      console.log("Submitting form data:", formData.bgColor);

      const formDataToSend = new FormData();
      formDataToSend.append("displayName", formData.displayName);
      formDataToSend.append("roleName", formData.roleName);
      formDataToSend.append("bgColor", formData.bgColor);
      formDataToSend.append("textColor", formData.textColor);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phoneNumber", formData.phoneNumber);
      formDataToSend.append("linkedIn", formData.linkedIn);
      formDataToSend.append("x", formData.x);
      formDataToSend.append("customURL", formData.customURL);
      formDataToSend.append("customURLName", formData.customURLName);
      formDataToSend.append("isMain", formData.isMain.toString());

      const response = await fetch(
        `http://localhost:5280/api/card/${fetchedCard.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formDataToSend,
        }
      );

      if (!response.ok) {
        const errorData = await response.text();
        setError(errorData);
        return;
      }

      // Update the card display
      const updatedCard = {
        ...originalCard,
        displayName: formData.displayName,
        roleName: formData.roleName,
        bgColor: formData.bgColor,
        textColor: formData.textColor,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        linkedIn: formData.linkedIn,
        x: formData.x,
        customURL: formData.customURL,
        customURLName: formData.customURLName,
        isMain: formData.isMain,
      };

      setFetchedCard(updatedCard);
      setOriginalCard(updatedCard);
      setSaveSuccess(true);

      // Clear save success after 3 seconds
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error("Error updating card:", error);
      setError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    // Reset form to original values
    setFormData({
      displayName: originalCard.displayName || "",
      roleName: originalCard.roleName || "",
      bgColor: originalCard.bgColor || "#ffffff",
      textColor: originalCard.textColor || "#000000",
      email: originalCard.email || "",
      phoneNumber: originalCard.phoneNumber || "",
      linkedIn: originalCard.linkedIn || "",
      x: originalCard.x || "",
      customURL: originalCard.customURL || "",
      customURLName: originalCard.customURLName || "",
      isMain: (originalCard as any).isMain || false,
    });

    // Reset card preview to original
    setFetchedCard(originalCard);

    // Clear errors and touched state
    setErrors({});
    setTouched({});
    setSaveSuccess(false);
  };

  const hasChanges = () => {
    if (!originalCard) return false;

    return (
      formData.displayName !== (originalCard.displayName || "") ||
      formData.roleName !== (originalCard.roleName || "") ||
      formData.bgColor !== (originalCard.bgColor || "#ffffff") ||
      formData.textColor !== (originalCard.textColor || "#000000") ||
      formData.email !== (originalCard.email || "") ||
      formData.phoneNumber !== (originalCard.phoneNumber || "") ||
      formData.linkedIn !== (originalCard.linkedIn || "") ||
      formData.x !== (originalCard.x || "") ||
      formData.customURL !== (originalCard.customURL || "") ||
      formData.customURLName !== (originalCard.customURLName || "") ||
      formData.isMain !== ((originalCard as any).isMain || false)
    );
  };

  if (loading) {
    return (
      <div className="w-screen h-screen grid place-items-center">
        <LoaderCircleIcon className=" animate-spin text-[#0051FF]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-screen h-screen grid place-items-center text-gray-500">
        <div className="grid place-items-center">
          <FrownIcon size={50} />
          <h1 className="font-bold">{error}</h1>
        </div>
      </div>
    );
  }

  if (!fetchedCard) {
    return (
      <div className="w-screen h-screen grid place-items-center text-gray-500">
        <div className="grid place-items-center">
          <FrownIcon size={50} />
          <h1 className="font-bold">Card not Found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="flex sm:flex-row flex-col-reverse h-screen">
      {isOwner && (
        <div className="sm:shadow-2xl shadow-menu sm:rounded-none rounded-xl p-10 sm:flex-initial flex-1 sm:w-1/3 w-full sm:max-w-[500px] sm:h-screen h-1/2 overflow-y-auto">
          <h1 className="text-2xl font-bold mb-4">Card information</h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Display Name */}
            <div className="relative">
              <input
                type="text"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                onFocus={() => handleFocus("displayName")}
                onBlur={handleBlur}
                className={`w-full border p-2 pt-6 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                  hasError("displayName")
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-[#0051FF]"
                }`}
                required
              />
              <label
                className={`absolute left-2 transition-all duration-200 pointer-events-none ${
                  isFieldActive("displayName")
                    ? `top-1 text-xs ${
                        hasError("displayName")
                          ? "text-red-500"
                          : "text-[#0051FF]"
                      }`
                    : "top-2 text-base text-gray-500"
                }`}
              >
                Display Name *
              </label>
              {hasError("displayName") && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.displayName}
                </p>
              )}
            </div>

            {/* Role Name */}
            <div className="relative">
              <input
                type="text"
                name="roleName"
                value={formData.roleName}
                onChange={handleInputChange}
                onFocus={() => handleFocus("roleName")}
                onBlur={handleBlur}
                className={`w-full border p-2 pt-6 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                  hasError("roleName")
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-[#0051FF]"
                }`}
                required
              />
              <label
                className={`absolute left-2 transition-all duration-200 pointer-events-none ${
                  isFieldActive("roleName")
                    ? `top-1 text-xs ${
                        hasError("roleName") ? "text-red-500" : "text-[#0051FF]"
                      }`
                    : "top-2 text-base text-gray-500"
                }`}
              >
                Role Name *
              </label>
              {hasError("roleName") && (
                <p className="text-red-500 text-xs mt-1">{errors.roleName}</p>
              )}
            </div>

            {/* Colors */}
            <div className="grid grid-cols-2 gap-4">
              <div className="relative">
                <input
                  type="color"
                  name="bgColor"
                  value={formData.bgColor}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus("bgColor")}
                  onBlur={handleBlur}
                  className={`w-full border p-1 h-12 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                    hasError("bgColor")
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#0051FF]"
                  }`}
                  required
                />
                <label className="block text-sm text-gray-600 mt-1">
                  Background Color *
                </label>
                {hasError("bgColor") && (
                  <p className="text-red-500 text-xs mt-1">{errors.bgColor}</p>
                )}
              </div>

              <div className="relative">
                <input
                  type="color"
                  name="textColor"
                  value={formData.textColor}
                  onChange={handleInputChange}
                  onFocus={() => handleFocus("textColor")}
                  onBlur={handleBlur}
                  className={`w-full border p-1 h-12 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                    hasError("textColor")
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-[#0051FF]"
                  }`}
                  required
                />
                <label className="block text-sm text-gray-600 mt-1">
                  Text Color *
                </label>
                {hasError("textColor") && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.textColor}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
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
                        hasError("email") ? "text-red-500" : "text-[#0051FF]"
                      }`
                    : "top-2 text-base text-gray-500"
                }`}
              >
                Email
              </label>
              {hasError("email") && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Phone Number */}
            <div className="relative">
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                onFocus={() => handleFocus("phoneNumber")}
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
                        hasError("phoneNumber")
                          ? "text-red-500"
                          : "text-[#0051FF]"
                      }`
                    : "top-2 text-base text-gray-500"
                }`}
              >
                Phone Number
              </label>
              {hasError("phoneNumber") && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.phoneNumber}
                </p>
              )}
            </div>

            {/* LinkedIn */}
            <div className="relative">
              <input
                type="url"
                name="linkedIn"
                value={formData.linkedIn}
                onChange={handleInputChange}
                onFocus={() => handleFocus("linkedIn")}
                onBlur={handleBlur}
                className={`w-full border p-2 pt-6 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                  hasError("linkedIn")
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-[#0051FF]"
                }`}
                placeholder="https://linkedin.com/in/your-profile"
              />
              <label
                className={`absolute left-2 transition-all duration-200 pointer-events-none ${
                  isFieldActive("linkedIn")
                    ? `top-1 text-xs ${
                        hasError("linkedIn") ? "text-red-500" : "text-[#0051FF]"
                      }`
                    : "top-2 text-base text-gray-500"
                }`}
              >
                LinkedIn
              </label>
              {hasError("linkedIn") && (
                <p className="text-red-500 text-xs mt-1">{errors.linkedIn}</p>
              )}
            </div>

            {/* X/Twitter */}
            <div className="relative">
              <input
                type="url"
                name="x"
                value={formData.x}
                onChange={handleInputChange}
                onFocus={() => handleFocus("x")}
                onBlur={handleBlur}
                className={`w-full border p-2 pt-6 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                  hasError("x")
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-[#0051FF]"
                }`}
                placeholder="https://x.com/your-handle"
              />
              <label
                className={`absolute left-2 transition-all duration-200 pointer-events-none ${
                  isFieldActive("x")
                    ? `top-1 text-xs ${
                        hasError("x") ? "text-red-500" : "text-[#0051FF]"
                      }`
                    : "top-2 text-base text-gray-500"
                }`}
              >
                X (Twitter)
              </label>
              {hasError("x") && (
                <p className="text-red-500 text-xs mt-1">{errors.x}</p>
              )}
            </div>

            {/* Custom URL */}
            <div className="relative">
              <input
                type="url"
                name="customURL"
                value={formData.customURL}
                onChange={handleInputChange}
                onFocus={() => handleFocus("customURL")}
                onBlur={handleBlur}
                className={`w-full border p-2 pt-6 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                  hasError("customURL")
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-[#0051FF]"
                }`}
                placeholder="https://your-website.com"
              />
              <label
                className={`absolute left-2 transition-all duration-200 pointer-events-none ${
                  isFieldActive("customURL")
                    ? `top-1 text-xs ${
                        hasError("customURL")
                          ? "text-red-500"
                          : "text-[#0051FF]"
                      }`
                    : "top-2 text-base text-gray-500"
                }`}
              >
                Custom URL
              </label>
              {hasError("customURL") && (
                <p className="text-red-500 text-xs mt-1">{errors.customURL}</p>
              )}
            </div>

            {/* Custom URL Name */}
            <div className="relative">
              <input
                type="text"
                name="customURLName"
                value={formData.customURLName}
                onChange={handleInputChange}
                onFocus={() => handleFocus("customURLName")}
                onBlur={handleBlur}
                className={`w-full border p-2 pt-6 rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                  hasError("customURLName")
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-[#0051FF]"
                }`}
                placeholder="Website"
              />
              <label
                className={`absolute left-2 transition-all duration-200 pointer-events-none ${
                  isFieldActive("customURLName")
                    ? `top-1 text-xs ${
                        hasError("customURLName")
                          ? "text-red-500"
                          : "text-[#0051FF]"
                      }`
                    : "top-2 text-base text-gray-500"
                }`}
              >
                Custom URL Name
              </label>
              {hasError("customURLName") && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.customURLName}
                </p>
              )}
            </div>

            {/* Main Card Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="isMain"
                id="isMain"
                checked={formData.isMain}
                onChange={handleInputChange}
                className="w-4 h-4 text-[#0051FF] border-gray-300 rounded focus:ring-[#0051FF] focus:ring-2"
              />
              <label
                htmlFor="isMain"
                className="text-sm font-medium text-gray-700 cursor-pointer"
              >
                Set as Main Card
              </label>
            </div>

            {/* Success Message */}
            {saveSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
                Card updated successfully!
              </div>
            )}

            {/* Submit Button */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleReset}
                disabled={!hasChanges() || saving}
                className={`flex-1 px-4 py-3 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2 ${
                  !hasChanges() || saving
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-500 text-white hover:bg-gray-600 cursor-pointer"
                }`}
              >
                Reset
              </button>

              <button
                type="submit"
                disabled={saving}
                className={`flex-1 px-4 py-3 rounded-lg transition-colors font-semibold flex items-center justify-center gap-2 ${
                  saving
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-[#0051FF] text-white hover:bg-[hsl(221,100%,45%)] cursor-pointer"
                }`}
              >
                {saving ? (
                  <LoaderCircleIcon className="animate-spin" size={20} />
                ) : (
                  <SaveIcon size={20} />
                )}
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="sm:h-screen flex sm:flex-1 items-center justify-center relative p-10">
        {isOwner && (
          <header className="absolute top-0 left-0 w-full ">
            <NavLink
              to={"/my-cards"}
              className="flex items-center hover:text-gray-800 transition-colors text-gray-500 gap-2 m-2 mx-4"
            >
              <ArrowLeftIcon size={24} />
              Back to My Cards
            </NavLink>
          </header>
        )}

        <div className="flex flex-col max-w-[400px] w-full gap-1">
          <div className="flex items-center justify-between text-gray-300">
            <Tooltip>
              <TooltipTrigger>
                <CopyIcon
                  className="hover:scale-105 cursor-pointer"
                  onClick={() => {
                    //copy url to clipboard
                    navigator.clipboard.writeText(window.location.href);
                  }}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Copy Card URL</p>
              </TooltipContent>
            </Tooltip>

            {isOwner && hasChanges() && (
              <div className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full">
                Preview Mode
              </div>
            )}
          </div>
          <CardComponent card={fetchedCard} isClickable={false} />
        </div>
      </div>
    </div>
  );
}

export default CardPage;
