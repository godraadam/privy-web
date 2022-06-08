export default function Help() {
  return (
    <div className="flex flex-col items-center px-20 bg-gradient-to-b from-black to-zinc-700">
      <div className="py-20">
        <div className="max-w-lg space-y-4">
          <h1 className="text-5xl font-bold">Installation guide</h1>
          <h2 className="py-6 text-4xl font-bold">
            1. Install the Privy Router
          </h2>
          <p>
            The Privy Router is the backend application running locally on your
            computer. Without the Privy Router you cannot interact with the
            Privy Network.
          </p>
          <p>
            The Privy Router can be installed as a docker image. To do that, you
            will need Docker installed and running on your computer.{" "}
          </p>
          <p>
            If you do not have it installed, you can install it from here:{" "}
            <a className="link" href="//docs.docker.com/get-docker/">
              Docker
            </a>
            .
          </p>
          <p>
            Once you have Docker installed, you will need to fetch the docker
            image. Open up a command line and enter the following:
          </p>
          <div className="mockup-code">
            <pre data-prefix="$">
              <code>docker pull godraadam/privyr:alpha</code>
            </pre>
          </div>
          <p>
            This will download the Privy Router docker image. Once it is
            finished downloading, you can run the router using the following
            command:
          </p>
          <div className="mockup-code">
            <pre data-prefix="$">
              <code>docker run --network host godraadam/privyr:alpha</code>
            </pre>
          </div>
          <p>
            At this point, you should be able to visit the login page here:{" "}
            <a className="link" href="/login">
              Login or Sign up
            </a>{" "}
            , and be able to create an account. Happy chatting!
          </p>
        </div>
      </div>
    </div>
  );
}
