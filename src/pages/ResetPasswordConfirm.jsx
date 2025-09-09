import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router";
import useAuthContext from "../hooks/useAuthContext";
import ErroAlert from "../components/ErroAlert";
import { useState } from "react";

const ResetPasswordConfirm = () => {
  const { resetPasswordConfirm, errorMsg } = useAuthContext();
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { uid, token } = useParams();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const resetData = {
        uid,
        token,
        new_password: data.new_password,
        re_new_password: data.re_new_password,
      };
      
      const response = await resetPasswordConfirm(resetData);
      if (response.success) {
        setSuccessMsg(response.message);
        
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (error) {
      console.log("Reset password confirm failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-base-200">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body">
          {errorMsg && <ErroAlert error={errorMsg} />}
          {successMsg && (
            <div role="alert" className="alert alert-success">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{successMsg}</span>
            </div>
          )}

          <h2 className="card-title text-2xl font-bold">Set New Password</h2>
          <p className="text-base-content/70">
            Enter your new password below
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
            <div className="form-control">
              <label className="label" htmlFor="new_password">
                <span className="label-text">New Password</span>
              </label>
              <input
                id="new_password"
                type="password"
                placeholder="••••••••"
                className={`input input-bordered w-full ${
                  errors.new_password ? "input-error" : ""
                }`}
                {...register("new_password", {
                  required: "New password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
              />
              {errors.new_password && (
                <span className="label-text-alt text-error">
                  {errors.new_password.message}
                </span>
              )}
            </div>

            <div className="form-control">
              <label className="label" htmlFor="re_new_password">
                <span className="label-text">Confirm New Password</span>
              </label>
              <input
                id="re_new_password"
                type="password"
                placeholder="••••••••"
                className={`input input-bordered w-full ${
                  errors.re_new_password ? "input-error" : ""
                }`}
                {...register("re_new_password", {
                  required: "Please confirm your new password",
                  validate: (value) =>
                    value === watch("new_password") || "Passwords do not match",
                })}
              />
              {errors.re_new_password && (
                <span className="label-text-alt text-error">
                  {errors.re_new_password.message}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-base-content/70">
              Remember your password?{" "}
              <Link to="/login" className="link link-primary">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordConfirm;
