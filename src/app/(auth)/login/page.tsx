import React from "react";
import AuthContainer from "@/components/auth/AuthContainer";
import LoginForm from "@/components/auth/LoginForm";

const Login = () => {
  return (
    <div>
      <AuthContainer
        title="Login"
        formRedirectLinkPlaceholder="Login"
        formRedirectText="No account yet? "
        formRediretLink="/Register"
      >
        <LoginForm />
      </AuthContainer>
    </div>
  );
};

export default Login;
