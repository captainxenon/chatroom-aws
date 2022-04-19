import "./index.css";

const UsersList = ({ users }) => {
  return (
    <div className="list-container">
      <h2>
        <i>Active Users</i>
      </h2>
      <ul>
        <li>
          {users.map((item) => (
            <h3>{item}</h3>
          ))}
        </li>
      </ul>
    </div>
  );
};

export default UsersList;
