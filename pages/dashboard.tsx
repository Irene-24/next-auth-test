import { useSession } from "next-auth/react";
import React from "react";
import Link from "next/link";

const Dashboard = () => {
  const { data: session, status } = useSession();

  console.log(session);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return (
      <p>
        You are not logged in.
        <Link href="/auth/login">
          <a>Log in</a>
        </Link>
      </p>
    );
  }

  return (
    <div>
      Dashboard should be protected. <br />
      <Link href="/admin">
        <a>Admin</a>
      </Link>
    </div>
  );
};

export default Dashboard;
