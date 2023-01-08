import React, { useState,useEffect } from 'react'
import styles from "../Home/Home.module.css";
import { Button } from "@material-ui/core";
import Link from "next/link";
import { Auth, Logger } from "aws-amplify";
import * as StringUtils from "../../utils/StringUtils";
import { Adsense } from '../../components/atoms'
import { useSessionContext } from "../../store/SessionContext";

const logger = new Logger('Secured');

const Secured = () => {
  // const [values, setValues] = useState({});
  const [data, setData] = useState({})

  function submitForm(e) {
    const city = e.target.city.value
    e.preventDefault();
    fetch(`https://uojf7nqo7uf7jjolnps4vnglsi0hmjtb.lambda-url.us-east-1.on.aws/?city=${city}`, {
      method: "GET",
    })
      .then((res) => res.json())
      .then(
        (res) => {
            setData(res)
        },
        (err) => console.log(err)
      );
  }

  const session = useSessionContext()
  const { user } = session;
  // const providerInfo = JSON.parse(user?.attributes)
  const [token, setToken] = useState()
  const username = StringUtils.replaceLastN(user.username, 16)
  // const userId = StringUtils.replaceFirstMAndLastN(providerInfo[0].userId, 8, 8)

  Auth.currentSession().then(data => setToken(StringUtils.replaceFirstMAndLastN(data.accessToken.jwtToken, 10, 10)));

  return (
    <div className={styles.container}>

      <main className={styles.main}>
        <div className={styles.grid}>
          <form onSubmit={submitForm} method="post">
            <input type="text" id="city" name="city" />
            <button className={styles.searchButton} type="submit">Search</button>
          </form>
          <div className={styles.card}>
            <div className={styles.wrapToken}>
              <p>Temperature : {data?.temperature} °C</p><br />
              <p>Weather Condition : {data?.weatherCondition?.type}</p>
              <p>Wind : {data?.wind?.speed} km/h</p><br />
              <p>Wind Direction: {data?.wind?.direction}</p><br />
              <p>Pressure : {data?.weatherCondition?.pressure}</p><br/>
              <p>Humidity : {data?.weatherCondition?.humidity}</p><br/>
            </div>
          </div>
          <div className={styles.card}>
            <h3>Authentication &rarr;</h3>
            {session.isAuthenticated &&
              <Button onClick={session.signOut}>Signout</Button>
            }
            {!session.isAuthenticated &&
              <Link href="/signin">
                <a>Sign in to Amazon Cognito</a>
              </Link>
            }
          </div>
        </div>
        <div>
        </div>
      </main>

    </div>
  )
}

export default Secured