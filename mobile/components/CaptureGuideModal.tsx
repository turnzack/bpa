import React, { useRef } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Colors } from '@/constants/Colors';
import Svg, { Path } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

interface Props {
    visible: boolean;
    onClose: () => void;
    onScan: () => void;
}

export function CaptureGuideModal({ visible, onClose, onScan }: Props) {
    const scale = useRef(new Animated.Value(1)).current;

    const handleScanPress = () => {
        Animated.sequence([
            Animated.timing(scale, { toValue: 0.9, duration: 100, useNativeDriver: true }),
            Animated.timing(scale, { toValue: 1, duration: 100, useNativeDriver: true }),
        ]).start(onScan);
    };

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.modal}>
                    <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                        <Text style={styles.closeText}>✕</Text>
                    </TouchableOpacity>

                    <View style={styles.dotsRow}>
                        <View style={styles.dot} />
                        <View style={[styles.dot, styles.activeDot]} />
                        <View style={styles.dot} />
                    </View>

                    <Text style={styles.title}>Capture Guide</Text>
                    <Text style={styles.instructions}>Hold steady. Tap when ready.{'\n'}Keep the sun in frame.</Text>

                    <View style={styles.arcContainer}>
                        {/* SVG Arc - A simple semi-ellipse approximation */}
                        <Svg height="100" width="260" style={styles.svg}>
                            <Path
                                d="M 10 50 Q 130 -20 250 50"
                                stroke="#666"
                                strokeWidth="3"
                                fill="none"
                            />
                        </Svg>

                        {/* Steps positioned absolutely over the arc */}
                        <View style={[styles.stepItem, { left: 10, top: 30 }]}>
                            <View style={styles.stepCircle}><Text style={styles.stepNumber}>1</Text></View>
                            <Text style={styles.stepText}>Font</Text>
                        </View>

                        <View style={[styles.stepItem, { left: '50%', marginLeft: -16, top: -10 }]}>
                            <View style={[styles.stepCircle, styles.activeStep]}><Text style={styles.stepNumber}>2</Text></View>
                            {/* 'Stop' text is technically above or below in Lua, let's put it below */}
                            <Text style={[styles.stepText, { marginTop: 35 }]}>Stop</Text>
                        </View>

                        <View style={[styles.stepItem, { right: 10, top: 30 }]}>
                            <View style={styles.stepCircle}><Text style={styles.stepNumber}>3</Text></View>
                            <Text style={styles.stepText}>Derginkis</Text>
                        </View>
                    </View>

                    <TouchableOpacity activeOpacity={1} onPress={handleScanPress} style={styles.scanBtnContainer}>
                        <Animated.View style={[styles.scanBtnOuter, { transform: [{ scale }] }]}>
                            <View style={styles.scanBtnInner}>
                                <Text style={styles.cameraIcon}>📷</Text>
                            </View>
                        </Animated.View>
                        <Text style={styles.scanLabel}>Scan</Text>
                    </TouchableOpacity>

                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modal: {
        width: width * 0.85,
        height: height * 0.65,
        backgroundColor: Colors.modalBg,
        borderRadius: 25,
        borderColor: '#4D4D4D',
        borderWidth: 1,
        alignItems: 'center',
        padding: 20,
    },
    closeBtn: {
        position: 'absolute',
        top: 15,
        right: 15,
        padding: 10,
    },
    closeText: {
        fontSize: 28,
        color: '#999',
    },
    dotsRow: {
        flexDirection: 'row',
        marginTop: 40,
        marginBottom: 20,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#666',
        marginHorizontal: 10,
    },
    activeDot: {
        backgroundColor: Colors.accentBlue,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.textPrimary,
        marginBottom: 10,
    },
    instructions: {
        fontSize: 15,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 30,
        lineHeight: 22,
    },
    arcContainer: {
        width: 260,
        height: 100,
        justifyContent: 'center',
        marginBottom: 20,
        position: 'relative',
    },
    svg: {
        position: 'absolute',
        top: 0,
        left: 0,
    },
    stepItem: {
        position: 'absolute',
        alignItems: 'center',
    },
    stepCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#4A4A4A',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.3)',
    },
    activeStep: {
        backgroundColor: Colors.accentBlue,
    },
    stepNumber: {
        color: 'white',
        fontWeight: 'bold',
    },
    stepText: {
        color: '#B3B3B3',
        fontSize: 12,
        marginTop: 4,
    },
    scanBtnContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    scanBtnOuter: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#40404D',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#666673',
        marginBottom: 10,
    },
    scanBtnInner: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: '#4D4D59',
        justifyContent: 'center',
        alignItems: 'center',
    },
    cameraIcon: {
        fontSize: 32,
    },
    scanLabel: {
        color: Colors.textPrimary,
        fontSize: 16,
        fontWeight: 'bold',
    },
});
