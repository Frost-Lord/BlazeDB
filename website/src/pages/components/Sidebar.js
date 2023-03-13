import Link from 'next/link';
import Head from "next/head";

const Sidebar = () => {
  return (
    <><>
      <Head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css" />
      </Head>
    </><nav className="sidebar">
        <header>
          <div className="image-text">
            <span className="image">
              <img src="logo.png" alt=""></img>
            </span>

            <div className="text logo-text">
              <span className="name">BlazeDB</span>
            </div>
          </div>

          <i className='bx bx-chevron-right toggle'></i>
        </header>

        <div className="menu-bar">
          <div className="menu">

            <li className="search-box">
              <i className="fa fa-light fa-rocket"></i>
              <input type="text" placeholder=" Search Databases..."></input>
            </li>

            <ul className="menu-links">
              <li className="nav-link">
                <a href="#">
                  <i className="fa fa-desktop"></i>
                  <span className="text nav-text"> Dashboard</span>
                </a>
              </li>

              <li className="nav-link">
                <a href="#">
                  <i className="fa fa-solid fa-code-fork"></i>
                  <span className="text nav-text"> Revenue</span>
                </a>
              </li>

              <li className="nav-link">
                <a href="#">
                  <i className="fa fa-solid fa-shield"></i>
                  <span className="text nav-text"> Notifications</span>
                </a>
              </li>

              <li className="nav-link">
                <a href="#">
                  <i className="fa-solid fa-gear"></i>
                  <span className="text nav-text"> Analytics</span>
                </a>
              </li>

              <li className="nav-link">
                <a href="#">
                  <i className="fa fa-regular fa-credit-card"></i>
                  <span className="text nav-text"> Likes</span>
                </a>
              </li>

            </ul>
          </div>

          <div className="bottom-content">
            <li className="log">
              <a href="#">
                <i class="fa-solid fa-right-from-bracket"></i>
                <span className="text nav-text"> Logout</span>
              </a>
            </li>

            <li className="mode">
              <div className="sun-moon">
                <i class="fa-solid fa-moon"></i>
              </div>
              <span className="mode-text text">Dark mode</span>

              <div className="toggle-switch">
                <span className="switch"></span>
              </div>
            </li>

          </div>
        </div>

      </nav></>
  );
};

export default Sidebar;