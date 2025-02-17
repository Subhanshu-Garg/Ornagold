import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { Theme } from "../constants/Theme";
import SectionHeader from "./SectionHeader";
import { fetchGoldRate } from "../services/goldRate";

type Metric = {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  lastUpdated: string;
};

export interface MetricCardsProps {}

const MetricCards = () => {
  const { theme } = useTheme();
  const styles = makeStyles(theme.colors);
  const [metric, setMetric] = useState({
    rate: "N/A",
    change: 0,
    changePercent: "N/A",
    lastUpdated: "N/A",
  });

  useEffect(() => {
    const getGoldRate = async () => {
      const data = await fetchGoldRate().catch((error) => {
        console.error("Error while fetching gold rate", error);
      });
      if (data) setMetric(data);
    };

    getGoldRate();
  }, []);

  const metrics: Metric[] = [
    {
      title: "24K Gold Rate",
      value: metric.rate,
      change: metric.changePercent,
      isPositive: metric.change >= 0,
      lastUpdated: metric.lastUpdated,
    },
    {
      title: "Making Charges",
      value: "12% Avg",
      change: "→ 0%",
      isPositive: true,
      lastUpdated: "Yesterday",
    },
  ];

  return (
    <>
      <SectionHeader title="Today's Metrics" />
      <FlatList
        horizontal
        data={metrics}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.subtitle}>{item.title}</Text>
            <View style={styles.measures}>
              <Text
                style={styles.value}
              >
                {item.value}
              </Text>
              <Text
                style={[
                  styles.change,
                  {
                    color: item.isPositive
                      ? theme.colors.success
                      : theme.colors.error,
                    marginLeft: 8,
                  },
                ]}
              >
                {item.change}
              </Text>
            </View>
            {item.lastUpdated && (
              <View style={styles.updatedContainer}>
                {/* <Text style={styles.updatedLabel}>Last updated:</Text> */}
                <Text style={styles.updatedValue}>As of {item.lastUpdated}</Text>
              </View>
            )}
          </View>
        )}
        contentContainerStyle={styles.container}
        showsHorizontalScrollIndicator={false}
      />
    </>
  );
};

const makeStyles = (colors: Theme["colors"]) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 15,
      marginVertical: 10,
    },
    card: {
      backgroundColor: colors.secondaryBackground,
      padding: 15,
      borderRadius: 10,
      marginRight: 15,
      width: 200,
    },
    subtitle: {
      color: colors.textSecondary,
      fontSize: 14,
      fontWeight: "bold",
    },
    value: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.textPrimary
    },
    change: {
      fontSize: 14,
      alignSelf: 'flex-end',
      marginBottom: 3, // Aligns better with the value text
    },
    updatedContainer: {
      marginTop: 8,
    },
    updatedLabel: {
      color: colors.textSecondary,
      fontSize: 12,
    },
    updatedValue: {
      color: colors.textSecondary,
      fontSize: 12,
      marginTop: 2, // Small space between label and value
    },
    measures: {
      flexDirection: 'row',
      alignItems: 'baseline',
      marginVertical: 5,
    }
  });

export default MetricCards;
