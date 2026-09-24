# 📒 Expense Tracker — The Whole Code, Explained Like Real Life

Think of this app as **a small expense office**:

- The **browser window** is the office building.
- **React** is the staff that redraws the office walls whenever something changes.
- **App.jsx** is the **office manager** — she holds the master list of expenses, does the math, and tells everyone what to display.
- **localStorage** is the **filing cabinet** — even if the office closes for the night (you refresh the page), the papers are still there in the morning.

Below, every file is explained line by line with a real-world analogy.

---

## 1. `src/main.jsx` — The Front Door of the Building

```jsx
import { StrictMode } from 'react'
```
**Analogy:** Hiring a strict supervisor (StrictMode) who double-checks every worker's work to catch mistakes early. It doesn't change what users see — it only helps *you* find bugs during development.

```jsx
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
```
**Analogy:** `createRoot` is the **construction crew** that finds the empty lot in the building (`<div id="root">` in `index.html`) and builds your whole app there. `BrowserRouter` is the **receptionist** who watches the address bar and knows which room to send visitors to.

```jsx
import './index.css'
import App from './App.jsx'
```
**Analogy:** Picking the office paint/decor (`index.css`) and hiring the manager (`App`).

```jsx
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```
**Analogy:** "Construction crew, build the app on that empty lot. Put the strict supervisor and the receptionist around the manager, then open for business." Everything you see on screen exists inside this one call.

---

## 2. `src/App.jsx` — The Office Manager (line by line)

### 2.1 The imports — hiring the staff

```jsx
import { Routes, Route } from "react-router-dom";
```
**Analogy:** Hiring the receptionist's *tools*: `Routes` is the reception desk, `Route` is the signpost that says "if the visitor typed *this* address, take them to *that* room."

```jsx
import useLocalStorage from "./hooks/useLocalStorage";
```
**Analogy:** Hiring a **personal assistant with a filing cabinet**. Whatever the manager writes down, the assistant also files away — so nothing is lost when the office closes (the page refreshes).

```jsx
import Header from "./components/Header";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
```
**Analogy:** The office **signboard** (Header), the **hallway direction signs** (Nav), and the **plaque at the exit door** (Footer). Small, fixed, reusable pieces.

```jsx
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
```
**Analogy:** The two **rooms** visitors can enter: the summary wall (Dashboard) and the working desk with the expense ledger (Expenses).

> **Note:** There is also a `src/context/ExpensesContext.jsx` file, but App.jsx doesn't import it — the Expenses *page* uses it. It's explained in section 3.7.

### 2.2 The starter data — demo papers on the desk

```jsx
const initialExpenses = [
  { id: 1, title: "Lunch", amount: 150, category: "Food" },
  { id: 2, title: "Taxi", amount: 80, category: "Transport" },
  { id: 3, title: "Electricity", amount: 420, category: "Bills" },
  { id: 4, title: "Cinema", amount: 200, category: "Fun" },
];
```
**Analogy:** On opening day, the manager places **four sample receipts** on the desk so the office doesn't look empty. Each receipt has:
- `id` — a **serial number** so we can tell receipts apart (important for deleting the exact right one).
- `title` — the **label** on the receipt.
- `amount` — how much was paid.
- `category` — which **envelope folder** it belongs to (Food, Transport, Bills, Fun).

### 2.3 The App component — the manager starts her shift

```jsx
function App() {
```
**Analogy:** Defining the manager herself. Nothing runs yet — this is just the **job description**. React runs it whenever it needs to redraw the screen.

### 2.4 State — the whiteboard and the filing assistant

```jsx
const [expenses, setExpenses] = useLocalStorage("expenses", initialExpenses);
```
**Analogy:** The manager puts the **master expense list on a whiteboard** (`expenses`), and keeps the **marker** to change it (`setExpenses`). Her assistant (the `useLocalStorage` hook) whispers at startup: *"There's a filed copy in the cabinet under the label 'expenses' — use that one"* and copies every change back into the cabinet.

So:
- First-ever visit → cabinet is empty → the four sample receipts go on the whiteboard.
- Any later visit → yesterday's list comes **back from the cabinet**.

```jsx
const [searchText, setSearchText] = useLocalStorage("searchText", "");
```
**Analogy:** A second whiteboard holding the **current search filter** (what the manager is looking for), also filed in the cabinet under `"searchText"`. It starts as an empty string — meaning "no filter, show everything."

### 2.5 Filtering — the sieve

```jsx
const filteredExpenses = expenses.filter((expense) =>
  expense.title.toLowerCase().includes(searchText.toLowerCase())
);
```
**Analogy:** Pour all receipts through a **sieve**. A receipt passes through only if its label contains the searched text.

- `.toLowerCase()` on both sides = the manager compares in **lowercase handwriting only**, so "Lunch", "LUNCH" and "lunch" all match. Like a bouncer who doesn't care whether your name is written in capitals.
- `.includes(...)` = "is the search word contained anywhere in the title?" Searching `"un"` still finds "Lunch".
- This does **not** change the whiteboard — it just decides *what's visible right now*. If `searchText` is `""`, every receipt passes through (every label "includes" nothing).

### 2.6 The total — the cash register

```jsx
const totalAmount = filteredExpenses.reduce(
  (sum, expense) => sum + expense.amount,
  0
);
```
**Analogy:** The manager feeds the **visible receipts one by one into a cash register**. The register starts at **0** and, for each receipt, adds its amount to the running total. `reduce` = "reduce a whole pile of receipts into one number."

### 2.7 The count — counting heads in the room

```jsx
const expenseCount = filteredExpenses.length;
```
**Analogy:** Simply counting **how many receipts passed the sieve**. `.length` is just counting the items in the list — no math needed.

### 2.8 Totals per category — sorting receipts into labeled envelopes

```jsx
const totalsByCategory = filteredExpenses.reduce((totals, expense) => {
  const currentTotal = totals[expense.category] || 0;
  return { ...totals, [expense.category]: currentTotal + expense.amount };
}, {});
```
**Analogy:** The manager sorts the visible receipts into **envelopes labeled Food, Transport, Bills, Fun** — and writes a running total on each envelope.

Step by step:
1. `reduce(..., {})` — start with **empty hands** (an empty object `{}` = no envelopes yet).
2. `totals[expense.category]` — look at the receipt's category and grab that envelope. If the envelope doesn't exist yet (or has no total written), `|| 0` means *"pretend it said 0."*
3. `{ ...totals, [expense.category]: currentTotal + expense.amount }` — the `...totals` (spread) is like **photocopying all existing envelopes**, then updating (or creating) just the one envelope with its new total. The result looks like: `{ Food: 150, Transport: 80, Bills: 420, Fun: 200 }`.

### 2.9 Finding the top category — the spending race

```jsx
const categoryEntries = Object.entries(totalsByCategory);
```
**Analogy:** `Object.entries` takes each envelope and turns it into a **name tag + amount pair**, like `[["Food", 150], ["Transport", 80], ...]`. It converts the object into a list we can sort.

```jsx
let topCategory = "-";
if (categoryEntries.length > 0) {
  const sorted = [...categoryEntries].sort((a, b) => b[1] - a[1]);
  topCategory = sorted[0][0];
}
```
**Analogy:** The envelopes line up for a **race** — biggest spender first. The `if` guard is the manager saying: *"If there are no envelopes at all, the winner board just shows a dash `-` (nobody raced)."*

- `[...categoryEntries]` = **photocopy the lineup first** so the original order isn't disturbed.
- `.sort((a, b) => b[1] - a[1])` = sort **from largest to smallest** (`b[1]` is the second item's amount, minus `a[1]`'s). Subtracting amounts is the judge's rule: bigger amount, front of the line.
- `sorted[0][0]` = the **first place winner's name** (first envelope in the sorted line → its label).

### 2.10 The handlers — how the manager changes the whiteboard

```jsx
function handleAdd(newExpense) {
  setExpenses((prevExpenses) => [newExpense, ...prevExpenses]);
}
```
**Analogy:** When the reception form comes in with a new receipt, the manager **puts the new receipt on top of the pile**. She never scribbles on the old pile — she **photocopies the old pile** (`...prevExpenses`) with the new receipt placed in front, and that photocopy becomes the new whiteboard.

Why write `setExpenses((prev) => ...)` instead of `setExpenses([...expenses, ...])`? Because the arrow-function form always works from the **latest, most current version of the pile** — like working from today's document instead of a photocopy from an hour ago. (React can batch several updates; the updater form protects you from using a stale copy.)

```jsx
function handleDelete(id) {
  setExpenses((prevExpenses) =>
    prevExpenses.filter((expense) => expense.id !== id)
  );
}
```
**Analogy:** Deleting works by **serial number**, not by position. "Remove the receipt whose serial number is NOT `id`" — i.e., the sieve keeps everyone *except* the one being evicted. It's like removing a guest from a party list by ticket number: everyone with a different ticket stays.

Again: no receipt is physically torn up; a **new list without that receipt** becomes the whiteboard.

```jsx
function handleSortByAmount() {
  setExpenses((prevExpenses) =>
    [...prevExpenses].sort((a, b) => b.amount - a.amount)
  );
}
```
**Analogy:** Rearranging the actual pile **from most expensive to cheapest** (the same race rule as the top category). The `[...prevExpenses]` photocopy matters here: `.sort()` would otherwise shuffle the original list in place — photocopying first is like sorting **a copy of the stack** and putting the sorted copy on the whiteboard.

### 2.11 The JSX return — drawing the office

```jsx
return (
  <div className="app">
```
**Analogy:** The manager hands over the **floor plan of the office**. JSX looks like HTML but it's React's way of describing what should be on screen.

```jsx
    <Header appName="Expense Tracker" />
```
**Analogy:** Mounting the **signboard** at the top, and handing it a note that says "your text is: Expense Tracker." Passing data into a component like this is called **props** — like handing a courier a sealed envelope with instructions.

```jsx
    <Nav />
```
**Analogy:** The **hallway signs** ("Dashboard", "Expenses") that visitors can click to move between rooms.

```jsx
    <Routes>
      <Route
        path="/"
        element={
          <Dashboard total={totalAmount} count={expenseCount} topCategory={topCategory} />
        }
      />
```
**Analogy:** The receptionist's rulebook. Rule 1: *"If the visitor is at the main address (`/`), take them into the **Dashboard room**, and hand them three report cards: the total, the count, and the winning category."*

```jsx
      <Route
        path="/expenses"
        element={
          <Expenses
            expenses={filteredExpenses}
            searchText={searchText}
            onSearchChange={setSearchText}
            onClearSearch={() => setSearchText("")}
            onAdd={handleAdd}
            onDelete={handleDelete}
            onSortByAmount={handleSortByAmount}
          />
        }
      />
    </Routes>
```
**Analogy:** Rule 2: *"At the `/expenses` address, take them into the **Expenses room** and hand them the toolkit: the visible receipts (already sieved), the current search text, the marker to change the search, an eraser to clear it (`setSearchText("")` wipes the search whiteboard), and three buttons-worth of instructions: add, delete, and sort."*

Note what's passed: the Expenses room gets the **already-filtered** list — the sieving happens here in the manager's office, the room just displays results.

```jsx
    <Footer />
  </div>
);
}

export default App;
```
**Analogy:** The plaque by the exit door, close the floor plan, and `export default App` pins the manager's job description on the noticeboard outside so `main.jsx` can hire her ("import App from './App.jsx'").

---

## 3. The Supporting Cast — the other files

### 3.1 `src/hooks/useLocalStorage.js` — the assistant with the filing cabinet

```js
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : initialValue;
  });
```
**Analogy:** Making state the smart way — with a **lazy initializer**. The `() =>` means the check runs **only once**, at setup. The assistant opens the cabinet drawer with the given label (`key`):
- Drawer has papers (`saved` is truthy) → read them out (`JSON.parse` turns the stored text back into real arrays/objects).
- Drawer is empty → use the starter papers (`initialValue`), e.g. the four sample receipts.

`JSON.stringify`/`JSON.parse` are needed because the cabinet (localStorage) can only store **text**, never real objects — like a fax machine: you must convert papers to text to send, and text back to papers to read.

```js
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
```
**Analogy:** A standing order: *"Whenever the whiteboard changes, file an updated copy in the cabinet."* The `[key, value]` list is the trigger — the effect re-runs only when those change. `JSON.stringify` converts the real objects into storable text.

```js
  return [value, setValue];
}
export default useLocalStorage;
```
**Analogy:** The assistant hands back two things: the current whiteboard contents, and the marker. App.jsx catches them as `const [expenses, setExpenses] = ...`.

### 3.2 `src/components/Header.jsx` — the signboard

```jsx
function Header({ appName }) {
  return <h1 className="title">{appName}</h1>;
}
```
**Analogy:** A signboard with one slot: whatever name you hand it (`appName`), it displays in big letters. Reusable — pass "Expense Tracker" today, "Budget Pro" tomorrow, same signboard.

### 3.3 `src/components/Nav.jsx` — the hallway signs

```jsx
<NavLink to="/" end className={({ isActive }) => (isActive ? "nav-link nav-link-active" : "nave-link")}>
  Dashboard
</NavLink>
```
**Analogy:** A sign that knows **which room you're standing in**. NavLink checks `isActive` ("am I the page you're currently on?") and lights up (`nav-link-active`) when true — like the glowing "You are here" on a mall map.
- `end` on the Dashboard link: only glow when the address is **exactly** `/`, not `/expenses` (otherwise every page would count as "under `/`" and Dashboard would always glow).
- `to="/expenses"`: the second sign, same logic.
- ⚠️ Tiny typo worth knowing: the first NavLink's else-branch says `"nave-link"` (n-a-v-e) — that class doesn't exist in your CSS, so the Dashboard link loses its styling when *inactive*. Harmless but easy to fix.

### 3.4 `src/components/Footer.jsx` — the exit plaque

```jsx
return <p>Built with react</p>;
```
**Analogy:** The little plaque at the door. Purely decorative, no props needed.

### 3.5 `src/pages/Dashboard.jsx` + `src/components/Summary.jsx` — the report wall

```jsx
function Dashboard({ total, count, topCategory }) {
  return (
    <div>
      <Summary total={total} count={count} topCategory={topCategory} />
    </div>
  );
}
```
**Analogy:** The Dashboard is a **corridor that just passes the report cards through** to the actual report wall. It receives three cards (total, count, topCategory) and immediately hands them to `Summary`. (Right now it adds nothing itself — a middleman.)

```jsx
<div className="summary-card">
  <p className="summary-label">Total</p>
  <p className="summary-value">{total}</p>
</div>
```
**Analogy:** Summary pins the three cards on the wall: each card has a **label** ("Total") and the **number** underneath — like three framed certificates: total spent, how many expenses, and which category won the spending race.

### 3.6 `src/pages/Expenses.jsx` — the working desk

```jsx
function Expenses({ expenses, searchText, onSearchChange, onClearSearch, onAdd, onDelete, onSortByAmount }) {
```
**Analogy:** The desk unpacks the toolkit the manager handed over: the sieved receipts, the search text, and the four instruction slips (change search, clear search, add, delete, sort).

```jsx
<ExpenseForm onAdd={onAdd} />
```
**Analogy:** The **intake form** on the desk. When the visitor fills it in, the form calls `onAdd` — which rings through to the manager's `handleAdd`.

```jsx
<input
  type="text"
  className="search-input"
  placeholder="Search expenses..."
  value={searchText}
  onChange={(event) => onSearchChange(event.target.value)}
```
**Analogy:** A **controlled search box**. Its displayed value is *always* whatever the manager's whiteboard says (`searchText`), and every keystroke reports back (`onChange`) so the manager updates the whiteboard — the box never owns its own text. Like a walkie-talkie: every word is relayed to base before it appears.

```jsx
onKeyDown={(event) => {
  if (event.key === "Escape") {
    onClearSearch();
  }
}}
```
**Analogy:** A hidden shortcut: **pressing Escape wipes the search** — the "reset" button.

```jsx
<button className="sort-button" onClick={onSortByAmount}>Sort by amount</button>
```
**Analogy:** A big button on the desk that yells to the manager: "Rearrange the pile, most expensive first!"

```jsx
<ExpensesProvider expenses={expenses} onDelete={onDelete}>
  <ExpenseList />
</ExpensesProvider>
```
**Analogy:** The desk sets up a **shared noticeboard** (Context) holding the receipts and the delete instruction, and hangs the list component *inside* it. Anything hung inside can read the noticeboard without the manager passing props down by hand — like a family corkboard everyone can read without the parent relaying messages to each child individually.

### 3.7 `src/context/ExpensesContext.jsx` — the family corkboard

```jsx
const ExpensesContext = createContext();
```
**Analogy:** Manufacturing the **empty corkboard** itself — just the board, nothing pinned yet.

```jsx
export function ExpensesProvider({ children, expenses, onDelete }) {
  return (
    <ExpensesContext.Provider value={{ expenses, onDelete }}>
      {children}
    </ExpensesContext.Provider>
  );
}
```
**Analogy:** The provider is the act of **hanging the corkboard on the wall** (with the receipts and the delete instruction pinned to it) and placing everything inside `{children}` within reach of the board.

```jsx
export function useExpenses() {
  return useContext(ExpensesContext);
}
```
**Analogy:** The **step stool** — any component that stands on it can read the corkboard. That's why `ExpenseList` and `ExpenseItem` can grab the receipts without App passing props through every level.

### 3.8 `src/components/ExpenseForm.jsx` — the intake form

```jsx
const [title, setTitle] = useState("");
const [amount, setAmount] = useState("");
const [category, setCategory] = useState("Food");
const [error, setError] = useState("");
const [isRecurring, setIsRecurring] = useState(false);
```
**Analogy:** The form has five **pencils-and-slots**: the title line (starts blank), the amount line (starts blank), the category dropdown (pre-set to Food), a sticky note for error messages (starts blank), and a "recurring?" checkbox (starts unticked).

```jsx
function handleSubmit(event) {
  event.preventDefault();
```
**Analogy:** When "Add" is clicked, `event.preventDefault()` is the manager **stopping the paper from flying off** — normally a form submit reloads the whole page, which would wipe the whiteboard. This says: "Stay on this page; handle it here."

```jsx
  if (title.trim() === "") {
    setError("Please enter a title.");
    return;
  }
```
**Analogy:** **Quality control, step 1.** `.trim()` strips spaces from both ends, so typing only spaces still counts as empty. Fail → write the complaint on the sticky note and **stop right there** (return = don't process further).

```jsx
  if (Number(amount) <= 0 || amount.trim() === "") {
    setError("Please enter an amount greater than 0.");
    return;
  }
```
**Analogy:** **Quality control, step 2.** Convert the amount text to a real number and check it's more than 0 — no free "0 ETB" receipts. Fail → sticky note again, stop.

```jsx
  setError("");
  const newExpense = {
    id: Date.now(),
    title: title,
    amount: Number(amount),
    category: category,
    isRecurring: isRecurring,
  };
```
**Analogy:** All checks passed → wipe the sticky note and **stamp a serial number on the new receipt**: `Date.now()` is the current moment as a number of milliseconds — practically unique, like a timestamp-based serial stamp. The amount is converted from text to a real number before being written down.

```jsx
  onAdd(newExpense);
  setTitle("");
  setAmount("");
  setCategory("Food");
  setIsRecurring(false);
}
```
**Analogy:** Hand the new receipt to the manager (`onAdd` → her `handleAdd` puts it on top of the pile), then **clean the form for the next customer**: blank title, blank amount, dropdown back to Food, checkbox unticked.

The JSX at the bottom is the form's layout: two input boxes wired to their slots (`value` shows the slot's content, `onChange` writes into it), a `<select>` dropdown with the five category options, the checkbox wired to `isRecurring`, the submit button, and `{error && <p className="form-error">{error}</p>}` — **the sticky note only appears if it has something written on it** ("error is truthy AND the message").

### 3.9 `src/components/ExpenseList.jsx` — the ledger reader

```jsx
const { expenses } = useExpenses();
```
**Analogy:** Stand on the step stool and read the corkboard: "give me the receipts."

```jsx
if (expenses.length === 0) {
  return <p className="empty-message">No expenses yet. Add your first one!</p>
}
```
**Analogy:** Empty board? Show a friendly **"out of stock" sign** instead of an empty frame.

```jsx
return (
  <ul className="expense-list">
    {expenses.map((expense) => (
      <ExpenseItem key={expense.id} id={expense.id} />
    ))}
  </ul>
);
```
**Analogy:** For every receipt on the corkboard, `map` **stamps out one row** in the ledger. Notice it passes only the `id` — each row is expected to **fetch its own full details from the corkboard**. `key={expense.id}` is React's **name tag for each row**, so when the list changes it knows exactly which row was added/removed instead of re-drawing everything.

### 3.10 `src/components/ExpenseItem.jsx` — one row of the ledger

```jsx
const HIGH_AMOUNT = 600;
```
**Analogy:** The office rule taped to the wall: **"Any expense over 600 ETB gets flagged."** A named constant reads better than a mystery `600` buried in code.

```jsx
const { expenses, onDelete } = useExpenses();
const expense = expenses.find((item) => item.id === id);
if (!expense) {
  return null;
}
```
**Analogy:** Each row gets its serial number (`id`), walks to the corkboard, and **finds its own receipt** (`find` = search the pile until the serial matches). If the receipt has vanished (deleted a moment ago), the row quietly **leaves the stage** (`return null` renders nothing) instead of crashing.

```jsx
const isHigh = Number(expense.amount) > HIGH_AMOUNT;
const isRecurring = expense.isRecurring;
```
**Analogy:** Two quick checks against the wall rule and the receipt's own "recurring" stamp.

```jsx
function handleDeleteClick() {
  onDelete(id);
}
```
**Analogy:** The row's delete button, when clicked, just **shouts the serial number to the manager** (`onDelete` → her `handleDelete`) — she handles the removal.

```jsx
<li className={isHigh ? "expense-item expense-item-high" : "expense-item"}>
```
**Analogy:** The row picks its **own outfit** based on the checks: expensive receipts wear the red/highlighted outfit, normal ones wear plain clothes. (In JSX, `condition ? A : B` is the inline "pick one of two" choice.)

```jsx
{isHigh && (
  <span className="expense-flag">High</span>
)}
{isRecurring && (
  <span className="expense-recurring">Monthly</span>
)}
```
**Analogy:** Stickers on the receipt: the "High" sticker is only stuck on if the amount is over 600; the "Monthly" sticker only if it's recurring. `{condition && <thing>}` = "**only if** this is true, render that."

```jsx
<span className="expense-amount">{expense.amount} ETB</span>
<button className="expense-delete" onClick={handleDeleteClick}>Delete</button>
```
**Analogy:** The amount (with its currency label) and the delete button, which triggers the shout described above.

---

## 4. How a Click Travels (the whole loop, one story)

1. You type "Add" form fields → `ExpenseForm` quality-checks → stamps a receipt → calls `onAdd` → App's `handleAdd` → `setExpenses` puts it **on top of the pile**.
2. The whiteboard changed → React **re-runs the manager** (`App`) → re-sieves with the current search → recomputes total, count, envelopes, winner → redraws only the parts that changed.
3. The assistant (`useLocalStorage`'s effect) notices the change and **files a copy in the cabinet**.
4. Refresh the page → `useState`'s lazy initializer reads the cabinet → your data is still there. 🎉

Delete and Sort work the same way: they never edit the pile in place — they always **photocopy, modify the copy, hang the copy**.

---

## 5. Small Quirks Worth Knowing (honest observations)

1. **`nave-link` typo** in `Nav.jsx` — inactive Dashboard link loses its styling (should be `nav-link`).
2. **The search text is saved to localStorage** (`useLocalStorage("searchText", "")`) — so if you refresh while searching "tax", it stays filtered. Arguably it should be plain `useState` so a refresh resets the view.
3. **`id: Date.now()`** — two expenses added within the same millisecond would collide (very unlikely in practice, but worth knowing).
4. **`App.css` exists but is never imported** — the app's styles come from `index.css` via `main.jsx`. If `App.css` holds styles you expect to see, that's why they don't show up.
5. **Derived data is recomputed on every render** — fine at this size; if the list grew to thousands, `useMemo` would be the tool to cache the math.
