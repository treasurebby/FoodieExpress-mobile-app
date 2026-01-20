import { Colors } from '@/constants/colors';
import { Check } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export interface TimelineStep {
    status: string;
    time: string;
    completed: boolean;
}

interface StatusTimelineProps {
    steps: TimelineStep[];
}

export default function StatusTimeline({ steps }: StatusTimelineProps) {
    return (
        <View style={styles.container}>
            {steps.map((step, index) => (
                <View key={index} style={styles.stepContainer}>
                    <View style={styles.indicatorColumn}>
                        <View style={[
                            styles.indicator,
                            step.completed ? styles.indicatorCompleted : styles.indicatorPending
                        ]}>
                            {step.completed && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
                        </View>
                        {index < steps.length - 1 && (
                            <View style={[
                                styles.connector,
                                step.completed ? styles.connectorCompleted : styles.connectorPending
                            ]} />
                        )}
                    </View>
                    <View style={styles.contentColumn}>
                        <Text style={[
                            styles.statusText,
                            step.completed ? styles.statusCompleted : styles.statusPending
                        ]}>
                            {step.status}
                        </Text>
                        <Text style={styles.timeText}>{step.time}</Text>
                    </View>
                </View>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 8,
    },
    stepContainer: {
        flexDirection: 'row',
        paddingBottom: 4,
    },
    indicatorColumn: {
        alignItems: 'center',
        marginRight: 16,
    },
    indicator: {
        width: 28,
        height: 28,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
    },
    indicatorCompleted: {
        backgroundColor: Colors.light.secondary,
        borderColor: Colors.light.secondary,
    },
    indicatorPending: {
        backgroundColor: Colors.light.background,
        borderColor: Colors.light.border,
    },
    connector: {
        width: 2,
        flex: 1,
        marginVertical: 4,
    },
    connectorCompleted: {
        backgroundColor: Colors.light.secondary,
    },
    connectorPending: {
        backgroundColor: Colors.light.border,
    },
    contentColumn: {
        flex: 1,
        paddingBottom: 20,
    },
    statusText: {
        fontSize: 15,
        fontWeight: '600',
        marginBottom: 2,
    },
    statusCompleted: {
        color: Colors.light.text,
    },
    statusPending: {
        color: Colors.light.textSecondary,
    },
    timeText: {
        fontSize: 13,
        color: Colors.light.textSecondary,
    },
});
