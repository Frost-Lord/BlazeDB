import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Head from "next/head";
import Sidebar from "../../../components/Sidebar";
import styles from "@/styles/Dashboard.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

const Manage = () => {
  const router = useRouter();
  const { token, dbname } = router.query;

  const toastOptions = {
    position: "top-right",
    autoClose: 3000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const [RootData, setRootData] = useState(null);
  const [schemaData, setSchemaData] = useState(null);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [DatabaseLogs, setDatabaseLogs] = useState(null);

  const handleSchemaButtonClick = (index) => {
    setSelectedRecord(RootData[index]);
    toast.success("Data loaded successfully", toastOptions);
  };

  useEffect(() => {
    async function fetchData() {
      if (token && dbname) {
        try {
          const RawData = await axios.post(
            `http://localhost:4000/api/${token}/${dbname}/getschema`
          );

          const schema = {
            id: { type: String, default: null },
            name: { type: String, default: null },
            age: { type: Number, default: null },
            PastNames: { type: Array, default: [] },
            Payments: { type: Array, default: [] },
          };

          setSchemaData(schema);
          setRootData(RawData.data);
          toast.success("Schema loaded", toastOptions);
        } catch (error) {
          console.log(error);
          toast.error("Their was an error loading your data", toastOptions);
        }
      }
    }
    async function fetchLogs() {
      if (token && dbname) {
        try {
          const RawData = await axios.post(
            `http://localhost:4000/api/${token}/${dbname}/logs`
          );
          setDatabaseLogs(RawData.data);
        } catch (error) {
          console.log(error);
          toast.error("Their was an error loading your data", toastOptions);
        }
      }
    }
    fetchLogs();
    fetchData();
  }, [token, dbname]);

  const colors = {
    Read: "#8884d8",
    Update: "#82ca9d",
  };
  
  const ActionChart = () => {
    const actionCounts = DatabaseLogs?.logs?.reduce((acc, log) => {
      const date = new Date(log.time * 1000).toISOString().slice(0, 10);
      const action = log.action;
      const key = `${date}:${action}`;
      acc[key] = acc[key] || { date, Read: 0, Update: 0 };
      acc[key][action]++;
      return acc;
    }, {});
  
    const actionCountsArray = actionCounts ? Object.values(actionCounts).map(({ date, ...rest }) => ({
      date,
      ...rest,
    })) : [];
  
    return (
      <LineChart width={800} height={350} data={actionCountsArray}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        {Object.keys(colors).map((action, index) => (
          <Line key={action} type="monotone" dataKey={action} stroke={colors[action]} />
        ))}
      </LineChart>
    );
  };
  
  

  const createCard = () => {
    return (
      <>
        <div className={styles.gridcontainer}>

          <div className={styles.searchBar}>
            <h1 className={styles.title}>Logs:</h1>
            <ActionChart />
          </div>

          <br></br>
          <div className={styles.searchBar}>
            <h1 className={styles.title}>Search</h1>
            <input type="text" placeholder="{ field: 'value' }" />
            <button className={styles.searchButton}>Search</button>
          </div>
          {RootData?.map((item, index) => (
            <div key={item.id} className={styles.cardSchema}>
              <div className={styles.headerSchema}>
                <h2>
                  Record {index + 1}:
                  <div className={styles.cardButtons && styles.right}>
                    <button
                      className={styles.selectButton}
                      onClick={() => handleSchemaButtonClick(index)}
                    >
                      Select
                    </button>
                    <button className={styles.deleteButton}>Delete</button>
                  </div>
                </h2>
              </div>
              <br />
              <div className={styles.bodySchema}>
                <div className="middle">
                  <div key={item.id} className={styles.card && styles.right}>
                    <div className={styles.bodySchema}>
                      {Object.keys(schemaData).map((key) => {
                        const value = Array.isArray(item[key])
                          ? item[key].join(", ")
                          : item[key];
                        return (
                          <div key={key} className={styles.field}>
                            <strong>{key}: </strong>
                            <span>{value}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {selectedRecord && (
          <div className={styles.sidebar2}>
            <h3>Schema for selected record: {selectedRecord?.id}</h3>
            <br></br>
            <div className={styles.schema2}>
              <h3>Schema:</h3>
              <pre>{JSON.stringify(schemaData, null, 2)}</pre>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className={styles.container}>
        <nav>
          <Sidebar />
        </nav>
        <main className={styles.main}>
          <div className={styles.contentWrapper}>{createCard()}</div>
        </main>
      </div>
      <ToastContainer />
    </>
  );
};

export default Manage;
