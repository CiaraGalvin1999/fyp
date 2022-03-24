import React, { Component } from 'react'
import { View, Text, Image, ActivityIndicator, ScrollView, TouchableOpacity } from 'react-native'
import helpers from '../components/helpers'
import Ionicons from 'react-native-vector-icons/Ionicons';

const styles = require('../stylesheets/mainStylesheet')
const pageStyle = require('../stylesheets/profileStyle')

class Profile extends Component {
    //Constructor
    //States are set here
    constructor() {
        super();

        this.state = {
            username: '',
            avatar: null,
            isLoading: true,
            numCatalogues: 0,
            about: '',
            recentCatalogues: []
        }
    }

    async getUserInfo() {
        // Gets token associated with user
        let token = await helpers.getToken();

        // GET request - requests catalogues from db for logged in user
        fetch('http://10.0.2.2:8000/api/getUserInfo', {
            method: 'GET',
            headers: {
                'Authorization': 'Token ' + token,
            }
        })
            // Catches errors
            .catch(function (error) {
                console.log("Error: " + error);
            })
            // Finds json data in response
            .then(response => response.json())
            // Saves catalogues to state and changes isLoading boolean to false
            .then(data => JSON.parse(data))
            .then(data => {
                this.setState({ username: data.username, numCatalogues: data.numCatalogues, recentCatalogues: data.recentCatalogues, isLoading: false })
            });
    }

    async componentDidMount() {
        this.getUserInfo()
    }


    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.loadingView}>
                    <ActivityIndicator size='large' />
                </View>
            )
        }
        else
            return (
                <View style={styles.container}>
                    <View style={pageStyle.headerContainer}>
                        <View style={pageStyle.addFriendsButton}>
                            <Ionicons name={'person-add-outline'} size={24} color={'#FFFFFF'} />
                        </View>
                        <View style={pageStyle.pageTitleContainer}>
                            <Text style={styles.pageTitleText}>Profile</Text>
                        </View>
                        <View style={pageStyle.settingsButton}>
                            <Ionicons name={'settings-outline'} size={24} color={'#FFFFFF'} />
                        </View>
                    </View>
                    <ScrollView>
                        <View style={pageStyle.profileContainer}>
                            <Image
                                style={pageStyle.avatar}
                                // source={{ uri: 'https://api.multiavatar.com/' + this.state.username + '.png' }}
                                source={{ uri: 'https://api.multiavatar.com/andrewchang.png' }}
                            />

                            <Text style={pageStyle.username}>@{this.state.username}</Text>
                        </View>
                        <View style={pageStyle.infoContainer}>
                            <View style={pageStyle.count}>
                                <Text style={pageStyle.countText}>Catalogues{'\n'}{this.state.numCatalogues}</Text>
                            </View>
                            <View style={pageStyle.count}>
                                <Text style={pageStyle.countText}>Followers{'\n'}102</Text>
                            </View>
                            <View style={pageStyle.count}>
                                <Text style={pageStyle.countText}>Following{'\n'}4</Text>
                            </View>
                        </View>
                        <View style={pageStyle.aboutContainer}>
                            {this.state.about.length > 0 && <Text style={pageStyle.aboutText}>{this.state.about}</Text>}
                        </View>
                        <Text style={pageStyle.catalogueSectionTitle}>Recent Catalogues</Text>
                        <ScrollView horizontal={true} style={pageStyle.cataloguesContainer}>
                            {this.state.recentCatalogues.length > 0 && !this.state.isLoading && (this.state.recentCatalogues).map((catalogue) => (
                                <TouchableOpacity
                                    key={catalogue.id}
                                    style={pageStyle.catalogueContainer}
                                //onPress={() => this.props.navigation.navigate('Catalogue', catalogue)}
                                >
                                    {/* Title of catalogue*/}
                                    <Text style={pageStyle.catalogueTitle}>{catalogue.title} </Text>



                                </TouchableOpacity>
                            ))}
                        </ScrollView>

                        {/*<View style={{height:80,width:110, backgroundColor:'#2F7571',marginLeft:6, marginTop:6}}></View>*/}


                    </ScrollView>
                </View>
            )
    }
}

export default Profile