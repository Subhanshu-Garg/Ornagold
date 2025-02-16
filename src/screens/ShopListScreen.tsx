import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  FlatList,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import ShopList from "../components/ShopList";
import MetricCards from "../components/MetricCards";
import { Theme } from "../constants/Theme";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { Filter, RootStackParamList, Shop, Sort } from "../types";
import { RouteProp } from "@react-navigation/native";
import SearchBar from "../components/SearchBar";
import { getMyShops, getShops } from "../services/shops";
import { errorHandler } from "../utils/errorHandler";
import SectionHeader from "../components/SectionHeader";
import LoadingSpinner from "../components/LoadingSpinner";
import useAppContext from "../hooks/useAppContext";
import FilterTag from "../components/FilterTag";
import Slider from "@react-native-community/slider";
import Modal from "react-native-modal";
import moment from "moment";

type ShopListScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, "ShopList">;
  route: RouteProp<RootStackParamList, "ShopList">;
};

const FILTER_TYPES: {
  id: string;
  label: string;
  options: {
    label: string,
    value: any
  }[]
  filters: Filter[];
  sorts: Sort[];
}[] = [
  {
    id: "goldRate",
    label: "Gold Rate",
    options: [
      { label: "5000 or less", value: 5000 },
      { label: "5500 or less", value: 5500 },
      { label: "6000 or less", value: 6000 },
      { label: "8000 or less", value: 8000 },
      { label: "10000 or less", value: 10_000 },
    ],
    filters: [
      {
        field: "goldRate",
        operator: "lte",
        value: 10_000,
      },
    ],
    sorts: [
      {
        field: "goldRate",
        order: "asc",
      },
    ],
  },
  {
    id: "makingCharges",
    label: "Making Charges",
    options: [
      { label: "10% or less", value: 10 },
      { label: "20% or less", value: 20 },
      { label: "30% or less", value: 30 },
      { label: "40% or less", value: 40 },
      { label: "50% or less", value: 50 },
    ],
    filters: [
      {
        field: "makingCharges",
        operator: "lte",
        value: 60,
      },
    ],
    sorts: [
      {
        field: "makingCharges",
        order: "asc",
      },
    ],
  },
  {
    id: "createdAt",
    label: "New Shops",
    options: [
      { label: "Last 7 Days", value: moment().subtract(7, 'days').toISOString() },
      { label: "Last 14 Days", value: moment().subtract(14, 'days').toISOString() },
      { label: "Last 30 Days", value: moment().subtract(30, 'days').toISOString() },
      { label: "Last 60 Days", value: moment().subtract(60, 'days').toISOString() },
      { label: "Last 90 Days", value: moment().subtract(90, 'days').toISOString() },
    ],
    filters: [
      {
        field: "createdAt",
        operator: "gte",
        value: moment().subtract(30, 'days').toISOString(),
      },
    ],
    sorts: [
      {
        field: "createdAt",
        order: "des",
      },
    ],
  },
];

export default function ShopListScreen({
  route,
  navigation,
}: ShopListScreenProps) {
  const { theme } = useTheme();
  const styles = makeStyles(theme.colors);
  const {
    title,
    searchQuery,
    filters: initialFilters,
    sort: initialSorts,
    isMyShops,
  } = route.params;
  const { myShops, location } = useAppContext();
  const [shops, setShops] = useState<Shop[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isShopsLoading, setIsShopLoading] = useState(false);
  const [openStagger, setOpenStagger] = useState<string | null>(null);

  const [filterTypes, setFilterTypes] = useState<typeof FILTER_TYPES>([]);

  const handleFilterChange = (
    filterType: (typeof FILTER_TYPES)[number],
    value: number
  ) => {
    const updatedFilter = {
      ...filterType,
      filters: [{ ...filterType.filters[0], value }],
    };

    setFilterTypes((prev) => {
      const index = prev.findIndex((f) => f.id === filterType.id);
      if (index === -1) {
        return [...prev, updatedFilter];
      }
      const newFilters = [...prev];
      newFilters[index] = updatedFilter;
      return newFilters;
    });
  };

  const loadShops = async (currentPage: number, filters?: typeof FILTER_TYPES) => {
    const filtrs = filters || filterTypes
    const fils: Filter[] = [];
    filtrs.forEach((f) => {
      fils.push(...f.filters);
    });

    const srts: Sort[] = [];
    filtrs.forEach((f) => {
      srts.push(...f.sorts);
    });
    try {
      const { shops: newShops, hasMore } = isMyShops
        ? { shops: myShops, hasMore: false }
        : await getShops(searchQuery, currentPage, fils, srts);

      setShops((prev) =>
        currentPage === 1 ? newShops : [...prev, ...newShops]
      );
      setHasMore(hasMore);
    } catch (error) {
      errorHandler.handle(error, "shop_list");
    } finally {
      setIsShopLoading(false);
    }
  };

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setPage(1);
      setIsShopLoading(true);
      if (isMyShops) {
        setShops(myShops);
        setIsShopLoading(false);
      } else {
        loadShops(1).finally(() => setIsShopLoading(false));
      }
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, isMyShops, myShops]);

  const handleLoadMore = () => {
    if (hasMore) {
      setPage((prev) => prev + 1);
      loadShops(page + 1);
    }
  };

  const renderFilterModal = () => {
    const filterType = FILTER_TYPES.find((f) => f.id === openStagger);
    if (!filterType) return null;

    const handleClearFilter = async () => {
      // First remove the filter
      const updatedFilters = filterTypes.filter((f) => f.id !== filterType.id);
      setFilterTypes(updatedFilters);
      // Then reload shops with updated filters
      setPage(1);
      setIsShopLoading(true);
      try {
        await loadShops(1, updatedFilters);
      } finally {
        setIsShopLoading(false);
        setOpenStagger(null);
      }
    };

    const currentFilter =
      filterTypes.find((f) => f.id === openStagger) || filterType;

    const options = filterType.options;
    // const min = filterType.min;
    // const max = filterType.max;
    // const step = filterType.steps;


    // for (let i = min; i <= max; i += step) {
    //   options.push(i);
    // }

    // Split options into pairs for two-column layout
    const optionPairs = [];
    for (let i = 0; i < options.length; i += 2) {
      optionPairs.push(options.slice(i, i + 2));
    }

    return (
      <View style={styles.filterContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.filterTitle}>{currentFilter.label}</Text>
          <TouchableOpacity onPress={() => setOpenStagger(null)}>
            <Text style={styles.closeButton}>×</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterOptions}>
          {optionPairs.map((pair, index) => (
            <View key={index} style={styles.optionRow}>
              {pair.map(({ label, value }) => (
                <TouchableOpacity
                  key={value}
                  style={styles.radioButtonContainer}
                  onPress={() => handleFilterChange(filterType, value)}
                >
                  <View style={styles.radioButton}>
                    {currentFilter.filters[0].value === value && (
                      <View style={styles.radioButtonSelected} />
                    )}
                  </View>
                  <Text style={styles.radioButtonText}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.filterActions}>
          <TouchableOpacity
            style={[styles.filterButton, styles.clearButton]}
            onPress={handleClearFilter}
          >
            <Text>Clear Filter</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, styles.applyButton]}
            onPress={() => {
              setPage(1);
              setOpenStagger(null);
              setIsShopLoading(true);
              loadShops(1).finally(() => setIsShopLoading(false));
            }}
          >
            <Text>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (isShopsLoading) {
    return <LoadingSpinner />;
  }

  return (
    <SafeAreaView style={styles.container}>
      {!isMyShops && (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
          >
            {FILTER_TYPES.map((filter) => (
              <FilterTag
                key={filter.id}
                label={filter.label}
                onPress={() => setOpenStagger(filter.id)}
                isActive={filterTypes?.some((f) => f.id === filter.id) || false}
              />
            ))}
          </ScrollView>

          <Modal
            isVisible={!!openStagger}
            onBackdropPress={() => setOpenStagger(null)}
            onSwipeComplete={() => setOpenStagger(null)}
            swipeDirection={["down"]}
            style={styles.modal}
          >
            <View style={styles.modalContent}>{renderFilterModal()}</View>
          </Modal>
        </>
      )}

      <ShopList
        shops={shops}
        onShopPress={(shop) => navigation.navigate("Shop", { shop })}
        onEndReached={handleLoadMore}
        hasMore={hasMore}
        horizontal={false}
        showDistance={true}
        location={location}
      />
    </SafeAreaView>
  );
}

const makeStyles = (colors: Theme["colors"]) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: 15,
      paddingLeft: 15
    },
    filterContainer: {
      maxHeight: 60,
      paddingBottom: 15,
    },
    modalOverlay: {
      flex: 1,
      justifyContent: "flex-end",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
      backgroundColor: colors.secondaryBackground,
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      justifyContent: 'flex-start'
    },
    filterTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 20,
      color: colors.textPrimary
    },
    filterContent: {
      minHeight: 120,
    },
    filterActions: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 10,
    },
    filterButton: {
      width: "48%",
      padding: 15,
      borderRadius: 10,
      borderWidth: 1,
      alignItems: "center",
    },
    applyButton: {
      backgroundColor: colors.primary,
    },
    ratingButton: {
      padding: 10,
      margin: 5,
      borderWidth: 1,
      borderRadius: 5,
    },
    selectedRating: {
      backgroundColor: colors.primary,
    },
    sliderContainer: {
      width: "100%",
      paddingHorizontal: 20,
    },
    slider: {
      width: "100%",
      height: 40,
    },
    modal: {
      justifyContent: "flex-end",
      margin: 0,
    },
    modalHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "baseline",
    },
    closeButton: {
      fontSize: 24,
      fontWeight: "bold",
      padding: 10,
      color: colors.textPrimary
    },
    filterOptions: {
      marginVertical: 20,
    },
    optionRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 10,
    },
    optionButton: {
      width: "48%", // Leave some space between buttons
      padding: 15,
      borderWidth: 1,
      borderColor: colors.textPrimary,
      borderRadius: 8,
    },
    selectedOption: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    clearButton: {
      backgroundColor: colors.secondaryBackground,
    },
    inputContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 20,
    },
    inputWrapper: {
      width: "45%",
    },
    inputLabel: {
      marginBottom: 5,
      fontSize: 16,
    },
    input: {
      borderWidth: 1,
      borderColor: colors.textPrimary,
      borderRadius: 8,
      padding: 10,
      fontSize: 16,
    },
    radioButtonContainer: {
      flexDirection: "row",
      alignItems: "center",
      width: "48%",
    },
    radioButton: {
      height: 20,
      width: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: colors.primary,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 10,
    },
    radioButtonSelected: {
      height: 12,
      width: 12,
      borderRadius: 6,
      backgroundColor: colors.primary,
    },
    radioButtonText: {
      color: colors.textPrimary,
      fontSize: 16,
    },
  });
