import { useState } from "react";

interface Props {
    callback: () => void,
    checkButton: () => boolean,
    setAlias: (alias: string) => void,
    setPassword: (alias: string) => void
}

export const AuthenticationFields = (props: Props) => {

  const actOnEnter = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key == "Enter" && !props.checkButton()) {
      props.callback();
    }
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
            onChange={(event) => props.setAlias(event.target.value)}
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
            onChange={(event) => props.setPassword(event.target.value)}
          />
          <label htmlFor="passwordInput">Password</label>
        </div>
      </>
    );
}

export default AuthenticationFields;