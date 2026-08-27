import "../styles/Dashboard.css";
import"../styles/SystemCard.css"
import Footer from "../components/footer";
import Systemcard, { systems } from "../components/SytemCArd";
function Dashboard() {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Panel de monitoreo</p>
        </div>

        <div className="header-user">
          <span>Usuario</span>

          <div className="user-avatar">
            U
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="titulo">
          <h3>Sistemas</h3>
          <h3>Crontask</h3>
          <h3>ScheduleReports</h3>
        </div>
        <div className="dashboard-title">
          <div className="systems-grid">
            {systems.map((system)=>(<Systemcard key={system.id} system={system}/>))}
          </div>
        </div>
      </main>
        <Footer/>
    </div>
    
  );
}

export default Dashboard;