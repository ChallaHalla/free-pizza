import React, {
  useRef, useContext, useEffect, useReducer, 
} from "react";
import * as api from "../services/api";

export const AppContext = React.createContext();

const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_GROUP":
      return {
        ...state,
        openGroupId: action.openGroupId,
      };
    default:
      return state;
  }
};

function AppProvider(props) {
  const [state, dispatch] = useReducer(reducer, {
    csvUploadProgress: 0,
  });
  const { children } = props;

  return (
    <AppContext.Provider
      value={{
        ...state,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppProvider;
