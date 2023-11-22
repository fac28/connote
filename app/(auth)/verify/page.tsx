import { Button, Link } from "@nextui-org/react";

const VerifyPage = () => {
  return (
    <div className="text-center mt-10">
      <h2 className="text-xl italic">Thanks for registering</h2>
      <p className="my-5 text-sm">
        Before you log in, you need to verify you email address.
      </p>
      <Link href="/login" className="italic">
      <Button color="secondary">Login</Button>
      </Link>
    </div>
  );
};

export default VerifyPage;
