// Imports
import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { panGestureHandlerCustomNativeProps } from 'react-native-gesture-handler/lib/typescript/handlers/PanGestureHandler';

// Stylesheets
const styles = require('../stylesheets/mainStylesheet');
const pageStyle = require('../stylesheets/showFicsSS')

const Result = ({ title, authors, summary }) => (
    <TouchableOpacity style={pageStyle.resultContainer}>
        {/* Title of fic*/}
        <Text style={pageStyle.titleText}>{title} </Text>
        {/* Authors of fic */}
        {authors.map((author, index) => (
            <Text style={pageStyle.authorText} key={index}>{author}</Text>
        ))}
        {/* Summary of fic */}
        {summary == '' && <Text style={pageStyle.summaryTextEmpty}>{'\n'}No summary available ... </Text>}
        {summary != '' && <Text style={pageStyle.summaryText}>{summary} </Text>}
    </TouchableOpacity>
);

class ShowFics extends Component {
    //Constructor
    //States are set here
    constructor() {
        super();

    }

    displayResults() {

    }



    render() {
        results = JSON.parse(this.props.route.params)

        return (
            <View style={styles.container}>
                <View style={pageStyle.buttonContainer}>
                    <TouchableOpacity
                        style={pageStyle.buttonStyle}
                        onPress={() => this.props.navigation.goBack()}
                    >
                        <Text style={styles.buttonText}>Back</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={pageStyle.allResultsContainer}>
                    {results.map((res) => (
                        <Result
                            title={res.title}
                            authors={res.authors}
                            summary={res.summary}
                            key={res.id}
                        />
                    ))}
                </ScrollView>
            </View>
        )
    }
}

export default ShowFics