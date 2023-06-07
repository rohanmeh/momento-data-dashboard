import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { TopicClient, TopicItem, CacheClient, CredentialProvider, Configurations, CacheSetFetch, CollectionTtl } from '@gomomento/sdk-web';
import TimeSeriesLineGraph from '../components/TimeSeriesLineGraph';

export default function Home() {
  	let [topicClient, setTopicClient] = useState(null);
	const topicClientRef = useRef(topicClient);
  	let [sensorData, setSensorData] = useState([]);
  	let [historicalSensorData, setHistoricalSensorData] = useState([]) 

	const updateTopicClient = (client) => {
			topicClientRef.current = client;
			setTopicClient(client);
		};
	useEffect(() => {
			topicClientRef.current = topicClient;
		}, [topicClient]);

	useEffect(() => {
			async function setupMomento() {
				initializeTopicClient();
			}

			if (!topicClient) {
				setupMomento();
			}
		}, []);


		useEffect(() => {
			const fetchData = async () => {
			  try {
				const response = await axios.get(process.env.NEXT_PUBLIC_API_ENDPOINT);
				response.data.shift()
				setHistoricalSensorData(response.data);
			  } catch (error) {
				console.log(error);
			  }
			};
		
			fetchData();
		  }, []);

	const initializeTopicClient = async () => {
		console.log(process.env.NEXT_PUBLIC_MOMENTO_TOKEN)
		if (!topicClient) {
			topicClient = new TopicClient({
				configuration: Configurations.Browser.v1(),
				credentialProvider: CredentialProvider.fromString({ authToken: process.env.NEXT_PUBLIC_MOMENTO_TOKEN })
			});

			updateTopicClient(topicClient);

			await topicClient.subscribe('test-cache', 'test', {
				onItem: handleItem,
				onError: (err) => console.log(err)
			});
		}
	};

	function handleItem(item) {
		setSensorData((sensorData) => [...sensorData, JSON.parse(item._value)])
	}


	return (
		<div>
		<h1>IoT Device Dashboard</h1>
		<TimeSeriesLineGraph data={historicalSensorData} />
		</div>
	);
}
