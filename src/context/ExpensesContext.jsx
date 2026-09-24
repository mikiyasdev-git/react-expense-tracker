import { createContext, useContext  } from "react";

const ExpensesContext = createContext ();

export function ExpensesProvider ({ children, expenses, onDelete }) {
  return (
    <ExpensesContext.Provider value={{ expenses, onDelete }}>
      {children}
    </ExpensesContext.Provider>
  );
}

export function useExpenses () {
  return useContext(ExpensesContext);
}