import { getAuth } from 'firebase/auth';
import firebaseApp from '../firebase';
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";

export default function NavBar({ user }) {
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || "");

  const onSignOutClicked = () => {
    const auth = getAuth(firebaseApp)
    auth.signOut()
  }

  const router = useRouter();

  const onEditProfileClicked = () => {
    router.push('/profile');
  };

  const getProfile = async () => {
    const response = await fetch(
      `/api/profile/${user?.email}/getOrCreateProfile`
    );
    const data = await response.json();
    setAvatarUrl(data.avatar || "");
  };

  useEffect(() => {
    if (user?.email) {
      getProfile();
    }
  }, [user?.email]);

  return (
    <nav className="navbar has-background-white" role="navigation" aria-label="main navigation">
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
          <strong>GigaChat</strong>
        </a>
      </div>

      <div id="navbarBasicExample" className="navbar-menu">
        <div className="navbar-start">
          <a className="navbar-item" href="/home">Home</a>
        </div>

        <div className="navbar-end">
          <div className="navbar-item">
            <div className="buttons">
                {avatarUrl && (
                <img
                    src={avatarUrl}
                    alt="Selected Avatar"
                    style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    marginRight: "10px",
                    marginButtom: "15px",
                    }}
                />)}
                <p className="is-size-5 mr-4 mb-2 has-text-weight-medium">{ user?.displayName ? user.displayName : '' }</p>
                <button className="button mr-2" onClick={onEditProfileClicked} style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'linear-gradient(to right, #8e2de2, #4a00e0)', // Purple gradient
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '8px',
                    cursor: 'pointer'
                }}>
                    <span className="icon mr-1">
                        <i className="fas fa-cog"></i> {/* FontAwesome's gear icon */}
                    </span>
                    <span>Edit Profile</span>
                </button>
                <a className="button is-primary" onClick={onSignOutClicked}>
                    <strong>Sign Out</strong>
                </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};