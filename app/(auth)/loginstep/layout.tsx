import { RegistrationProvider } from "./context/registration-context";
import { LoginStepGoogleProvider } from "./_componets/google-auth-provider";

export default function LoginstepLayout({ children }: { children: React.ReactNode }) {
  return (
    <RegistrationProvider>
      <LoginStepGoogleProvider>{children}</LoginStepGoogleProvider>
    </RegistrationProvider>
  );
}
