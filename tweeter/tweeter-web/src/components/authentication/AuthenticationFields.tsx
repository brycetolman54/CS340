import { useState } from "react";

interface Props {
    callback: () => void
}

export const AuthenticationFields = (props: Props) => {

  const [alias, setAlias] = useState("");
  const [password, setPassword] = useState("");

  const actOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !checkSubmitButtonStatus()) {
      props.callback();
    }
  };

  const checkSubmitButtonStatus = (): boolean => {
    return !alias || !password;
  };

    return (
      <>
        <div className="form-floating">
          <input
            type="text"
            className="form-control"
            size={50}
            id="aliasInput"
            placeholder="name@example.com"
            onKeyDown={(event) => actOnEnter(event)}
            onChange={(event) => setAlias(event.target.value)}
          />
          <label htmlFor="aliasInput">Alias</label>
        </div>
        <div className="form-floating mb-3">
          <input
            type="password"
            className="form-control bottom"
            id="passwordInput"
            placeholder="Password"
            onKeyDown={(event) => actOnEnter(event)}
            onChange={(event) => setPassword(event.target.value)}
          />
          <label htmlFor="passwordInput">Password</label>
        </div>
      </>
    );
}

export default AuthenticationFields;