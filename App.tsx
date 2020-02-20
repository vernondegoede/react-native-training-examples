import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableHighlight,
  View,
  ViewStyle,
  Image,
  ImageStyle
} from "react-native";

interface Styles {
  // View
  container: ViewStyle;
  emptyScreenContainer: ViewStyle;
  lastJobContainer: ViewStyle;

  // Text
  notFoundText: TextStyle;
  jobContainer: TextStyle;
  heading: TextStyle;
  jobTitle: TextStyle;
  jobDescription: TextStyle;

  // Image
  companyLogo: ImageStyle;
}

const CONTAINER_HORIZONTAL_SPACING = 20;

const styles = StyleSheet.create<Styles>({
  emptyScreenContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  container: {
    padding: CONTAINER_HORIZONTAL_SPACING,
    paddingTop: 80
  },
  notFoundText: {
    color: "red"
  },
  heading: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 30
  },
  jobContainer: {
    marginBottom: 30,
    marginLeft: -CONTAINER_HORIZONTAL_SPACING,
    marginRight: -CONTAINER_HORIZONTAL_SPACING,
    paddingLeft: CONTAINER_HORIZONTAL_SPACING,
    paddingRight: CONTAINER_HORIZONTAL_SPACING
  },
  jobTitle: {
    fontSize: 21,
    margin: 0,
    fontWeight: "bold"
  },
  jobDescription: {
    marginTop: 5,
    fontSize: 16,
    color: "#696969"
  },
  lastJobContainer: {
    marginBottom: 140
  },
  companyLogo: {
    width: 50,
    height: 50,
    marginBottom: 10
  }
});

interface Job {
  id: string;
  type: string;
  url: string;
  created_at: string;
  company: string;
  company_url: string;
  location: string;
  title: string;
  description: string;
  how_to_apply: string;
  company_logo: string;
}

export default function App() {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setRefreshing] = useState<boolean>(false);
  const [jobs, setJobs] = useState<Job[]>([]);

  const fetchJobs = async () => {
    try {
      const jobsRequest = await fetch("https://jobs.github.com/positions.json");

      const response = await jobsRequest.json();
      setJobs(response);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  if (isLoading) {
    return (
      <View style={styles.emptyScreenContainer}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (jobs.length === 0) {
    return (
      <View style={styles.emptyScreenContainer}>
        <Text style={styles.notFoundText}>No jobs found :-(</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          tintColor="#000"
          refreshing={isRefreshing}
          onRefresh={() => {
            setRefreshing(true);
            fetchJobs();
          }}
        />
      }
    >
      <Text style={styles.heading}>GitHub Jobs</Text>
      {jobs.map((job, index) => {
        const isLast = index + 1 === jobs.length;

        return (
          <TouchableHighlight
            key={job.id}
            underlayColor="rgba(232, 232, 232, 1)"
            onPress={() => {
              Linking.openURL(job.url);
            }}
          >
            <View
              style={[
                isLast
                  ? [styles.jobContainer, styles.lastJobContainer]
                  : styles.jobContainer
              ]}
            >
              {job.company_logo && (
                <Image
                  style={styles.companyLogo}
                  source={{ uri: job.company_logo }}
                  resizeMode="contain"
                />
              )}
              <Text style={styles.jobTitle}>
                {job.title} @ {job.company}
              </Text>
              <Text numberOfLines={3} style={styles.jobDescription}>
                {job.description.replace(/<[^>]*>?/gm, "")}
              </Text>
            </View>
          </TouchableHighlight>
        );
      })}
    </ScrollView>
  );
}
