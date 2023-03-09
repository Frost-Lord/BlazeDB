import Link from 'next/link';

const Sidebar = () => {
  return (
    <nav>
      <ul>
        <li>
          <strong>BlazeDB:</strong>
        </li>
        <br></br>
        <li>
          <strong>Organizations:</strong>
          <ul>
            <li>
              <a href="#">Frost-Lord's Org</a>
            </li>
          </ul>
        </li>
        <br></br>
        <li>
          <strong>Account:</strong>
          <ul>
            <li>
              <a href="#">Preferences</a>
            </li>
            <li>
              <a href="#">Access Tokens</a>
            </li>
          </ul>
        </li>
        <br></br>
        <li>
          <strong>Documentation:</strong>
          <ul>
            <li>
              <a href="#">Guides</a>
            </li>
            <li>
              <a href="#">API Reference</a>
            </li>
          </ul>
        </li>
        <li>
          <a href="#">Logout</a>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;