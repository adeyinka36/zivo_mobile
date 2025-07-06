import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import PaymentService from '../services/paymentService';
import { PaymentHistory } from '../../types/payment';

export default function PaymentHistoryScreen() {
  const router = useRouter();
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const loadPaymentHistory = async (page: number = 1, refresh: boolean = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else if (page === 1) {
        setLoading(true);
      }

      const history = await PaymentService.getPaymentHistory(page);
      
      if (page === 1) {
        setPaymentHistory(history);
      } else {
        setPaymentHistory(prev => prev ? {
          ...history,
          payments: [...prev.payments, ...history.payments]
        } : history);
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadPaymentHistory();
  }, []);

  const onRefresh = () => {
    setCurrentPage(1);
    loadPaymentHistory(1, true);
  };

  const loadMore = () => {
    if (paymentHistory && currentPage < paymentHistory.pagination.last_page) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadPaymentHistory(nextPage);
    }
  };

  const formatAmount = (amount: number) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'succeeded':
        return '#10B981';
      case 'failed':
        return '#EF4444';
      case 'pending':
        return '#F59E0B';
      case 'refunded':
        return '#6B7280';
      default:
        return '#6B7280';
    }
  };

  const renderPaymentItem = ({ item }: { item: any }) => (
    <View className="bg-gray-800 rounded-lg p-4 mb-3">
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-white font-semibold flex-1" numberOfLines={1}>
          {item.media.name}
        </Text>
        <Text 
          className="text-sm font-medium ml-2"
          style={{ color: getStatusColor(item.status) }}
        >
          {item.status.toUpperCase()}
        </Text>
      </View>
      
      <View className="flex-row justify-between items-center">
        <Text className="text-gray-300 text-sm">
          {formatDate(item.created_at)}
        </Text>
        <Text className="text-yellow-400 font-bold">
          {formatAmount(item.amount)}
        </Text>
      </View>
      
      {item.paid_at && (
        <Text className="text-gray-400 text-xs mt-1">
          Paid: {formatDate(item.paid_at)}
        </Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 bg-black justify-center items-center">
        <Text className="text-white">Loading payment history...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row items-center justify-between p-4 border-b border-gray-800">
        <TouchableOpacity onPress={() => router.back()}>
          <ArrowLeftIcon color="#FFFF00" size={24} />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">Payment History</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Payment List */}
      <FlatList
        data={paymentHistory?.payments || []}
        renderItem={renderPaymentItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FFFF00"
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.1}
        ListEmptyComponent={
          <View className="flex-1 justify-center items-center py-8">
            <Text className="text-gray-400 text-center">
              No payment history found
            </Text>
          </View>
        }
        ListFooterComponent={
          paymentHistory && currentPage < paymentHistory.pagination.last_page ? (
            <View className="py-4">
              <Text className="text-gray-400 text-center">Loading more...</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
} 