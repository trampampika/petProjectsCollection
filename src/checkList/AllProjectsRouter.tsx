import { MoodCalendar } from "./moodCalendar/MoodCalendar";
import { BarChartContainer } from "./barChart/BarChartContainer";
import { BoardsContainer } from "./boards/BoardsContainer";

import { Dogs } from "./Dogs";

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import "./AllProjectsRouterStyles.css";

export const AllProjectsRouter: React.FC = () => {
  // checks boards changes


  return (
<Router>
  <nav>
    <ul>
      <li>
        <Link to="/boards">Boards</Link>
      </li>
      <li>
        <Link to="/calendar">Mood Calendar</Link>
      </li>
      <li>
        <Link to="/chart">Bar Chart</Link>
      </li>
      <li>
        <Link to="/dogs">Dogs</Link>  {/* Добавлено! */}
      </li>
    </ul>
  </nav>

  <Routes>
    <Route
      path="/boards"
      element={
        <section className="boardsSection">
          <BoardsContainer />
        </section>
      }
    />
    <Route
      path="/calendar"
      element={
        <section className="moodCalendarSection">
          <MoodCalendar />
        </section>
      }
    />
    <Route
      path="/chart"
      element={
        <section className="barChartSection">
          <div className="barChartContainer">
            <BarChartContainer />
          </div>
        </section>
      }
    />
    <Route
      path="/dogs"
      element={
        <section className="boardsSection">
          <Dogs />
        </section>
      }
    />
  </Routes>
</Router>
  );
};
