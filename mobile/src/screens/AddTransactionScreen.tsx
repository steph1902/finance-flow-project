/**
 * Add Transaction Screen
 * Form for adding new income/expense transactions
 */

import React, { useState, useCallback } from 'react';
import {
    View,
    Text,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Input, Card } from '@/components/ui';
import { financeApi } from '@/services/api';
import { categories, getCategoryIcon } from '@/services/mockData';
import { getErrorMessage } from '@/utils/errorHandler';
import type { TransactionType, TransactionCategory, CreateTransactionPayload } from '@/types';
import type { AddTransactionScreenProps } from '@/types/navigation';

export default function AddTransactionScreen({
    navigation
}: AddTransactionScreenProps): React.JSX.Element {
    const [type, setType] = useState<TransactionType>('expense');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState<TransactionCategory>('other');
    const [description, setDescription] = useState('');
    const [merchantName, setMerchantName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (!amount.trim()) {
            newErrors.amount = 'Amount is required';
        } else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            newErrors.amount = 'Please enter a valid amount';
        }

        if (!description.trim()) {
            newErrors.description = 'Description is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = useCallback(async (): Promise<void> => {
        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const payload: CreateTransactionPayload = {
                amount: parseFloat(amount),
                type,
                category,
                description: description.trim(),
                date: new Date().toISOString(),
                merchantName: merchantName.trim() || undefined,
            };

            await financeApi.addTransaction(payload);

            Alert.alert(
                'Success',
                'Transaction added successfully!',
                [{ text: 'OK', onPress: () => navigation.goBack() }]
            );
        } catch (error) {
            Alert.alert('Error', getErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    }, [amount, type, category, description, merchantName, navigation]);

    return (
        <SafeAreaView className="flex-1 bg-gray-50" edges={['bottom']}>
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ padding: 20 }}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Type Toggle */}
                    <View className="flex-row mb-6">
                        <TouchableOpacity
                            className={`flex-1 py-4 rounded-l-xl ${type === 'expense' ? 'bg-red-500' : 'bg-gray-200'
                                }`}
                            onPress={() => setType('expense')}
                            activeOpacity={0.8}
                        >
                            <Text className={`text-center font-semibold ${type === 'expense' ? 'text-white' : 'text-gray-600'
                                }`}>
                                Expense
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            className={`flex-1 py-4 rounded-r-xl ${type === 'income' ? 'bg-green-500' : 'bg-gray-200'
                                }`}
                            onPress={() => setType('income')}
                            activeOpacity={0.8}
                        >
                            <Text className={`text-center font-semibold ${type === 'income' ? 'text-white' : 'text-gray-600'
                                }`}>
                                Income
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Amount Input */}
                    <Card variant="elevated" padding="lg" style={{ marginBottom: 16 }}>
                        <Text className="text-gray-500 text-sm mb-2">Amount</Text>
                        <View className="flex-row items-center">
                            <Text className="text-3xl font-bold text-gray-400 mr-2">$</Text>
                            <Input
                                placeholder="0.00"
                                value={amount}
                                onChangeText={(text) => {
                                    setAmount(text.replace(/[^0-9.]/g, ''));
                                    if (errors.amount) setErrors({ ...errors, amount: '' });
                                }}
                                keyboardType="decimal-pad"
                                error={errors.amount}
                                containerStyle={{ flex: 1, marginBottom: 0 }}
                            />
                        </View>
                    </Card>

                    {/* Category Selector */}
                    <Card variant="elevated" padding="md" style={{ marginBottom: 16 }}>
                        <Text className="text-gray-500 text-sm mb-3">Category</Text>
                        <View className="flex-row flex-wrap">
                            {categories
                                .filter(c => type === 'income' ? ['salary', 'investment', 'other'].includes(c) : true)
                                .map((cat) => (
                                    <TouchableOpacity
                                        key={cat}
                                        className={`px-3 py-2 rounded-full mr-2 mb-2 ${category === cat ? 'bg-blue-500' : 'bg-gray-100'
                                            }`}
                                        onPress={() => setCategory(cat)}
                                        activeOpacity={0.7}
                                    >
                                        <Text className={`${category === cat ? 'text-white' : 'text-gray-700'}`}>
                                            {getCategoryIcon(cat)} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                        </View>
                    </Card>

                    {/* Description & Merchant */}
                    <Card variant="elevated" padding="md" style={{ marginBottom: 16 }}>
                        <Input
                            label="Description"
                            placeholder="What was this transaction for?"
                            value={description}
                            onChangeText={(text) => {
                                setDescription(text);
                                if (errors.description) setErrors({ ...errors, description: '' });
                            }}
                            error={errors.description}
                        />

                        <Input
                            label="Merchant (Optional)"
                            placeholder="Where did you spend/receive?"
                            value={merchantName}
                            onChangeText={setMerchantName}
                        />
                    </Card>

                    {/* Submit Button */}
                    <Button
                        title={isSubmitting ? 'Adding...' : `Add ${type === 'income' ? 'Income' : 'Expense'}`}
                        variant={type === 'income' ? 'primary' : 'danger'}
                        onPress={handleSubmit}
                        loading={isSubmitting}
                        disabled={isSubmitting}
                        fullWidth
                        size="lg"
                    />
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}
